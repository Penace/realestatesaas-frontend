import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../../services/api";
import { useToast } from "../../context/ToastProvider";
import Button from "../../components/common/Button";

export default function Settings() {
  const { showToast } = useToast();

  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [requireApproval, setRequireApproval] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setDefaultCurrency(data.defaultCurrency || "USD");
        setRequireApproval(data.requireApproval ?? true);
        setMaintenanceMode(data.maintenanceMode ?? false);
      } catch (err) {
        showToast("Failed to load settings", "error");
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        defaultCurrency,
        requireApproval,
        maintenanceMode,
      });
      showToast("Settings saved.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Settings</h1>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <label className="font-medium text-gray-700">Default Currency</label>
          <select
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ILS">ILS</option>
            <option value="AED">AED</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="JPY">JPY</option>
            <option value="CNY">CNY</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium text-gray-700">
            Require Approval for Agents
          </label>
          <input
            type="checkbox"
            checked={requireApproval}
            onChange={() => setRequireApproval(!requireApproval)}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium text-gray-700">Maintenance Mode</label>
          <input
            type="checkbox"
            checked={maintenanceMode}
            onChange={() => setMaintenanceMode(!maintenanceMode)}
            className="w-5 h-5"
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        loading={saving}
        size="md"
        variant="primaryLight"
      >
        Save Settings
      </Button>
    </div>
  );
}
