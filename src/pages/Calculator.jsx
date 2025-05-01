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
      <div className="px-6 py-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden gap-8">
          {/* Left Panel: Inputs */}
          <div className="w-full flex flex-col justify-between p-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mortgage Calculator
              </h1>
              <p className="text-gray-500 mb-6">
                Estimate your monthly mortgage payment based on loan terms.
              </p>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col col-span-1">
                  <label className="mb-1 font-medium text-gray-700 min-h-[1.5rem] block">
                    Loan Term (years)
                  </label>
                  <div className="flex items-center space-x-4 w-full">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className="flex-grow appearance-none h-2 w-full bg-blue-200 rounded-full outline-none transition-all hover:bg-blue-300 focus:bg-blue-300"
                    />
                    <span className="w-12 text-right text-gray-700">
                      {loanTerm}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col col-span-1">
                  <label className="mb-1 font-medium text-gray-700 min-h-[1.5rem] block">
                    Secondary Loan (%)
                  </label>
                  <div className="flex items-center space-x-4 w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={secondaryLoanPercent}
                      onChange={(e) =>
                        setSecondaryLoanPercent(Number(e.target.value))
                      }
                      className="flex-grow appearance-none h-2 w-full bg-blue-200 rounded-full outline-none transition-all hover:bg-blue-300 focus:bg-blue-300"
                    />
                    <span className="w-12 text-right text-gray-700">
                      {secondaryLoanPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="col-span-1">
                  <TextInput
                    label={
                      <label className="block mb-1 font-medium text-gray-700 leading-snug">
                        Property Price
                      </label>
                    }
                    name="price"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="e.g. 500000"
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label={
                      <label className="block mb-1 font-medium text-gray-700 leading-snug">
                        Down Payment
                      </label>
                    }
                    name="downPayment"
                    value={downPayment}
                    onChange={(e) =>
                      setDownPayment(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="e.g. 100000"
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label={
                      <label className="block mb-1 font-medium text-gray-700 leading-snug">
                        Primary Interest Rate (%)
                      </label>
                    }
                    name="primaryInterestRate"
                    value={primaryInterestRate}
                    onChange={(e) =>
                      setPrimaryInterestRate(parseFloat(e.target.value) || 0)
                    }
                    placeholder="e.g. 3.5"
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label={
                      <label className="block mb-1 font-medium text-gray-700 leading-snug">
                        Secondary Interest Rate (%)
                      </label>
                    }
                    name="secondaryInterestRate"
                    value={secondaryInterestRate}
                    onChange={(e) =>
                      setSecondaryInterestRate(parseFloat(e.target.value) || 0)
                    }
                    placeholder="e.g. 4.0"
                  />
                </div>
              </div>

              {/* Loan Type + Variable Options */}
              <div className="flex flex-col mb-6">
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
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="col-span-1">
                    <TextInput
                      label={
                        <label className="block mb-1 font-medium text-gray-700 leading-snug">
                          Initial Fixed Period (years)
                        </label>
                      }
                      name="fixedPeriodYears"
                      type="number"
                      value={fixedPeriodYears}
                      onChange={(e) =>
                        setFixedPeriodYears(
                          Math.min(
                            Math.max(Number(e.target.value), 1),
                            loanTerm
                          )
                        )
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <TextInput
                      label={
                        <label className="block mb-1 font-medium text-gray-700 leading-snug">
                          Adjustment Rate (%)
                        </label>
                      }
                      name="adjustmentRate"
                      type="number"
                      value={adjustmentRate}
                      onChange={(e) =>
                        setAdjustmentRate(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Results */}
          <div
            className="w-full bg-gray-50 rounded-xl p-6 flex flex-col justify-between shadow"
            ref={exportRef}
          >
            <div className="flex-1 flex flex-col justify-center space-y-4 text-center px-6 py-15">
              {monthlyPayment ? (
                <>
                  <div>
                    <p className="text-xl text-gray-800">
                      Estimated Monthly Payment:
                      <span className="font-bold text-blue-600">
                        {" "}
                        {currencySymbol}
                        {monthlyPayment}
                      </span>
                    </p>
                  </div>
                  <div className="text-gray-700 space-y-2">
                    <p>
                      Total Payment:{" "}
                      <span className="font-semibold text-blue-600">
                        {currencySymbol}
                        {totalPayment}
                      </span>
                    </p>
                    <p>
                      Total Interest:{" "}
                      <span className="font-semibold text-blue-600">
                        {currencySymbol}
                        {totalInterest}
                      </span>
                    </p>
                    <p>
                      Primary Loan Portion:{" "}
                      <span className="text-blue-600">
                        {100 - secondaryLoanPercent}%
                      </span>{" "}
                      | Secondary:{" "}
                      <span className="text-blue-600">
                        {secondaryLoanPercent}%
                      </span>
                    </p>
                    <p>
                      Loan Type:{" "}
                      <span className="font-semibold text-blue-600">
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
                          Adjustment Rate:{" "}
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
                </>
              ) : (
                <p className="text-gray-400">
                  Enter loan details to see results.
                </p>
              )}
            </div>
            {/* Export buttons moved outside results box */}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6 max-w-7xl mx-auto px-4">
        <Button variant="primaryLight" size="sm" onClick={handleGeneratePDF}>
          Download PDF
        </Button>
        <Button
          variant="primaryLight"
          size="sm"
          onClick={() => alert("Email functionality coming soon!")}
        >
          Email Results
        </Button>
      </div>
    </>
  );
}
