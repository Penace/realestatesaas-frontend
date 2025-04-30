import { useState, useEffect, useRef } from "react";
import TextInput from "../components/form/TextInput";
import Button from "../components/common/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Calculator() {
  const currencySymbol = "$"; // Default, can be expanded later
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState(30);
  const [secondaryLoanPercent, setSecondaryLoanPercent] = useState(0);
  const [loanType, setLoanType] = useState("Fixed");

  const [fixedPeriodYears, setFixedPeriodYears] = useState(5);
  const [adjustmentRate, setAdjustmentRate] = useState(1.0);

  const [primaryInterestRate, setPrimaryInterestRate] = useState(3.5);
  const [secondaryInterestRate, setSecondaryInterestRate] = useState(4.0);

  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const exportRef = useRef();

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Mortgage Calculator Results", 14, 20);

    const rows = [
      ["Estimated Monthly Payment", `$${monthlyPayment}`],
      ["Total Payment", `$${totalPayment}`],
      ["Total Interest", `$${totalInterest}`],
      ["Primary Loan Portion", `${100 - secondaryLoanPercent}%`],
      ["Secondary Loan Portion", `${secondaryLoanPercent}%`],
      ["Loan Type", loanType],
      ["Primary Interest Rate", `${primaryInterestRate}%`],
      ["Secondary Interest Rate", `${secondaryInterestRate}%`],
    ];

    if (loanType === "Variable") {
      rows.push(
        ["Initial Fixed Period", `${fixedPeriodYears} years`],
        ["Adjustment Rate", `${adjustmentRate}%`]
      );
    }

    doc.autoTable({
      startY: 30,
      head: [["Label", "Value"]],
      body: rows,
    });

    doc.save("mortgage_results.pdf");
  };

  useEffect(() => {
    const P = Number(price) - Number(downPayment);
    const n = Number(loanTerm) * 12;

    if (!P || !n || P <= 0) {
      setMonthlyPayment(null);
      setTotalPayment(null);
      setTotalInterest(null);
      return;
    }

    const primaryLoanAmount = P * ((100 - secondaryLoanPercent) / 100);
    const secondaryLoanAmount = P * (secondaryLoanPercent / 100);

    let M1 = 0;
    let M2 = 0;

    if (loanType === "Fixed" || loanType === "InterestOnly") {
      const r1 = primaryInterestRate / 100 / 12;
      const r2 = secondaryInterestRate / 100 / 12;

      if (loanType === "Fixed") {
        M1 =
          (primaryLoanAmount * r1 * Math.pow(1 + r1, n)) /
          (Math.pow(1 + r1, n) - 1);
        M2 =
          (secondaryLoanAmount * r2 * Math.pow(1 + r2, n)) /
          (Math.pow(1 + r2, n) - 1);
      } else if (loanType === "InterestOnly") {
        M1 = primaryLoanAmount * r1;
        M2 = secondaryLoanAmount * r2;
      }
    } else if (loanType === "Variable") {
      // Variable rate logic
      const fixedMonths = fixedPeriodYears * 12;
      const remainingMonths = n - fixedMonths;

      if (remainingMonths <= 0) {
        // Entire loan at initial rates
        const r1 = primaryInterestRate / 100 / 12;
        const r2 = secondaryInterestRate / 100 / 12;

        M1 =
          (primaryLoanAmount * r1 * Math.pow(1 + r1, n)) /
          (Math.pow(1 + r1, n) - 1);
        M2 =
          (secondaryLoanAmount * r2 * Math.pow(1 + r2, n)) /
          (Math.pow(1 + r2, n) - 1);
      } else {
        // Initial fixed period payment
        const r1_initial = primaryInterestRate / 100 / 12;
        const r2_initial = secondaryInterestRate / 100 / 12;

        const M1_initial =
          (primaryLoanAmount * r1_initial * Math.pow(1 + r1_initial, n)) /
          (Math.pow(1 + r1_initial, n) - 1);
        const M2_initial =
          (secondaryLoanAmount * r2_initial * Math.pow(1 + r2_initial, n)) /
          (Math.pow(1 + r2_initial, n) - 1);

        // Remaining balance after fixed period
        const balancePrimary =
          primaryLoanAmount * Math.pow(1 + r1_initial, fixedMonths) -
          M1_initial *
            ((Math.pow(1 + r1_initial, fixedMonths) - 1) / r1_initial);
        const balanceSecondary =
          secondaryLoanAmount * Math.pow(1 + r2_initial, fixedMonths) -
          M2_initial *
            ((Math.pow(1 + r2_initial, fixedMonths) - 1) / r2_initial);

        // Adjusted rates after fixed period
        const r1_adjusted = (primaryInterestRate + adjustmentRate) / 100 / 12;
        const r2_adjusted = (secondaryInterestRate + adjustmentRate) / 100 / 12;

        // Payments for remaining period
        const M1_remaining =
          (balancePrimary *
            r1_adjusted *
            Math.pow(1 + r1_adjusted, remainingMonths)) /
          (Math.pow(1 + r1_adjusted, remainingMonths) - 1);
        const M2_remaining =
          (balanceSecondary *
            r2_adjusted *
            Math.pow(1 + r2_adjusted, remainingMonths)) /
          (Math.pow(1 + r2_adjusted, remainingMonths) - 1);

        // Weighted average monthly payment
        M1 = (M1_initial * fixedMonths + M1_remaining * remainingMonths) / n;
        M2 = (M2_initial * fixedMonths + M2_remaining * remainingMonths) / n;
      }
    }

    const totalMonthly = M1 + M2;
    const totalPay = totalMonthly * n;
    const totalInt = totalPay - P;

    setMonthlyPayment(totalMonthly.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
  }, [
    price,
    downPayment,
    loanTerm,
    secondaryLoanPercent,
    loanType,
    fixedPeriodYears,
    adjustmentRate,
    primaryInterestRate,
    secondaryInterestRate,
  ]);

  return (
    <>
      <style>
        {`@media print {
          nav, footer, header, .non-export {
            display: none !important;
          }
          .export-container {
            padding: 20px;
            page-break-inside: avoid;
          }
        }`}
      </style>
      <div className="min-h-screen py-10 px-6 bg-white">
        <div className="grid grid-cols-2 gap-6 max-w-6xl w-full bg-white p-6 rounded-xl shadow-lg">
          {/* Top-left: Title and description */}
          <div className="col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mortgage Calculator
            </h1>
            <p className="text-gray-500">
              Estimate your monthly mortgage payment based on loan terms.
            </p>
            {/* Sliders directly below title/description */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="loanTerm"
                  className="mb-1 font-medium text-gray-700"
                >
                  Loan Term (years)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    id="loanTerm"
                    min="1"
                    max="40"
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="flex-grow appearance-none h-2 bg-blue-200 rounded-full outline-none transition-all hover:bg-blue-300 focus:bg-blue-300"
                  />
                  <span className="w-12 text-right text-gray-700">
                    {loanTerm}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Secondary Loan (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={secondaryLoanPercent}
                  onChange={(e) =>
                    setSecondaryLoanPercent(Number(e.target.value))
                  }
                  className="appearance-none h-2 bg-blue-200 rounded-full outline-none transition-all hover:bg-blue-300 focus:bg-blue-300"
                />
                <span className="text-right text-gray-700">
                  {secondaryLoanPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Inputs block under sliders */}
          <div className="col-span-2 grid grid-cols-2 gap-6 mt-2">
            <div className="space-y-4">
              <TextInput
                label="Property Price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="e.g. 500000"
              />
              <TextInput
                label="Down Payment"
                name="downPayment"
                value={downPayment}
                onChange={(e) =>
                  setDownPayment(e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="e.g. 100000"
              />
              <TextInput
                label="Primary Interest Rate (%)"
                name="primaryInterestRate"
                value={primaryInterestRate}
                onChange={(e) =>
                  setPrimaryInterestRate(parseFloat(e.target.value) || 0)
                }
                placeholder="e.g. 3.5"
              />
              <TextInput
                label="Secondary Interest Rate (%)"
                name="secondaryInterestRate"
                value={secondaryInterestRate}
                onChange={(e) =>
                  setSecondaryInterestRate(parseFloat(e.target.value) || 0)
                }
                placeholder="e.g. 4.0"
              />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="loanType"
                  className="mb-1 font-medium text-gray-700"
                >
                  Loan Type
                </label>
                <select
                  id="loanType"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Variable">Variable</option>
                  <option value="InterestOnly">Interest-Only</option>
                </select>
              </div>
              {loanType === "Variable" && (
                <>
                  <div className="flex flex-col">
                    <label
                      htmlFor="fixedPeriodYears"
                      className="mb-1 font-medium text-gray-700"
                    >
                      Initial Fixed Period (years)
                    </label>
                    <input
                      type="number"
                      id="fixedPeriodYears"
                      min="1"
                      max={loanTerm}
                      value={fixedPeriodYears}
                      onChange={(e) =>
                        setFixedPeriodYears(
                          Math.min(
                            Math.max(Number(e.target.value), 1),
                            loanTerm
                          )
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="adjustmentRate"
                      className="mb-1 font-medium text-gray-700"
                    >
                      Adjustment Rate (%) after Fixed Period
                    </label>
                    <input
                      type="number"
                      id="adjustmentRate"
                      step="0.1"
                      value={adjustmentRate}
                      onChange={(e) =>
                        setAdjustmentRate(parseFloat(e.target.value) || 0)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results and export section, full width bottom row */}
          <div
            className="col-span-2 flex flex-col justify-between"
            ref={exportRef}
          >
            <div className="export-container bg-white p-6 rounded-xl shadow min-h-[320px] grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Results text column */}
              <div className="col-span-1 flex flex-col justify-center">
                {monthlyPayment ? (
                  <>
                    <div className="text-center">
                      <p className="text-xl text-gray-800">
                        Estimated Monthly Payment:
                        <span className="font-bold text-blue-600">
                          {" "}
                          {currencySymbol}
                          {monthlyPayment}
                        </span>
                      </p>
                    </div>
                    {totalPayment && totalInterest && (
                      <div className="text-gray-700 space-y-2 mt-4">
                        <p>
                          Total Payment:
                          <span className="font-semibold text-blue-600">
                            {" "}
                            {currencySymbol}
                            {totalPayment}
                          </span>
                        </p>
                        <p>
                          Total Interest:
                          <span className="font-semibold text-blue-600">
                            {" "}
                            {currencySymbol}
                            {totalInterest}
                          </span>
                        </p>
                        <p>
                          Primary Loan Portion:{" "}
                          <span className="text-blue-600">
                            {100 - secondaryLoanPercent}%
                          </span>{" "}
                          | Secondary Loan Portion:{" "}
                          <span className="text-blue-600">
                            {secondaryLoanPercent}%
                          </span>
                        </p>
                        <p>
                          Loan Type:
                          <span className="font-semibold text-blue-600">
                            {" "}
                            {loanType}
                          </span>
                        </p>
                        {loanType === "Variable" && (
                          <>
                            <p>
                              Initial Fixed Period:{" "}
                              <span className="text-blue-600">
                                {fixedPeriodYears} years
                              </span>
                            </p>
                            <p>
                              Adjustment Rate After Fixed Period:{" "}
                              <span className="text-blue-600">
                                {adjustmentRate}%
                              </span>
                            </p>
                          </>
                        )}
                        <p>
                          Primary Interest Rate:{" "}
                          <span className="text-blue-600">
                            {primaryInterestRate}%
                          </span>
                        </p>
                        <p>
                          Secondary Interest Rate:{" "}
                          <span className="text-blue-600">
                            {secondaryInterestRate}%
                          </span>
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full min-h-[140px]">
                    <p className="text-gray-400 text-center">
                      Enter loan details to see results.
                    </p>
                  </div>
                )}
              </div>
              {/* Export buttons column */}
              <div className="col-span-1 flex flex-col justify-end">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
                  <Button
                    variant="primaryLight"
                    size="sm"
                    onClick={handleGeneratePDF}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="primaryLight"
                    size="sm"
                    onClick={() => {
                      alert("Email functionality coming soon!");
                    }}
                  >
                    Email Results
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
