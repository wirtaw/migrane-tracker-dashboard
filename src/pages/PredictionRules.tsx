import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  PredictionRule,
  CreatePredictionRulePayload,
  RuleCondition,
  RuleConditionSource,
  RuleConditionParameter,
  OperatorEnum,
} from '../models/predictions.types';
import {
  fetchPredictionRules,
  createPredictionRule,
  updatePredictionRule,
  deletePredictionRule,
} from '../services/predictions';
import { Plus, Trash2, Edit, Save, X, BrainCircuit } from 'lucide-react';

const defaultCondition: RuleCondition = {
  source: 'weather',
  parameter: 'temperature',
  operator: 'gt',
  value: 0,
};

const emptyPayload: CreatePredictionRulePayload = {
  name: '',
  conditions: [{ ...defaultCondition }],
  alertMessage: '',
  isEnabled: true,
};

export default function PredictionRules() {
  const { apiSession } = useAuth();
  const [rules, setRules] = useState<PredictionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePredictionRulePayload>(emptyPayload);

  useEffect(() => {
    if (apiSession?.accessToken) {
      loadRules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSession]);

  const loadRules = async () => {
    try {
      setLoading(true);
      if (!apiSession?.accessToken) return;
      const data = await fetchPredictionRules(apiSession.accessToken);
      setRules(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiSession?.accessToken) return;

    try {
      setError(null);
      if (isEditing && editingId) {
        await updatePredictionRule(editingId, formData, apiSession.accessToken);
      } else {
        await createPredictionRule(formData, apiSession.accessToken);
      }
      await loadRules();
      resetForm();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!apiSession?.accessToken) return;
    if (!window.confirm('Are you sure you want to delete this rule?')) return;

    try {
      setError(null);
      await deletePredictionRule(id, apiSession.accessToken);
      await loadRules();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete rule');
    }
  };

  const editRule = (rule: PredictionRule) => {
    setIsEditing(true);
    setEditingId(rule._id);
    setFormData({
      name: rule.name,
      conditions: [...rule.conditions],
      alertMessage: rule.alertMessage,
      isEnabled: rule.isEnabled,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ ...emptyPayload, conditions: [{ ...defaultCondition }] });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { ...defaultCondition }],
    });
  };

  const removeCondition = (index: number) => {
    const minConditions = 1;
    if (formData.conditions.length > minConditions) {
      const newConditions = [...formData.conditions];
      newConditions.splice(index, 1);
      setFormData({ ...formData, conditions: newConditions });
    }
  };

  const updateCondition = (index: number, field: keyof RuleCondition, value: number | string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value } as RuleCondition;
    setFormData({ ...formData, conditions: newConditions });
  };

  if (loading && rules.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading prediction rules...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            Prediction Rules
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage rules to alert you based on weather and solar conditions.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Rule
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {isEditing && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Edit Rule' : 'Create Rule'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleCreateOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-3 mt-1 w-full rounded-md p-2">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={e => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rule is enabled
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Conditions
                </label>
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Condition
                </button>
              </div>
              {formData.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <select
                    value={condition.source}
                    onChange={e =>
                      updateCondition(index, 'source', e.target.value as RuleConditionSource)
                    }
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    <option value="weather">Weather</option>
                    <option value="solar">Solar Activity</option>
                  </select>

                  <select
                    value={condition.parameter}
                    onChange={e =>
                      updateCondition(index, 'parameter', e.target.value as RuleConditionParameter)
                    }
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    <option value="temperature">Temperature</option>
                    <option value="pressure">Pressure</option>
                    <option value="humidity">Humidity</option>
                    <option value="uvIndex">UV Index</option>
                    <option value="kpIndex">KP Index</option>
                    <option value="aIndex">A Index</option>
                  </select>

                  <select
                    value={condition.operator}
                    onChange={e =>
                      updateCondition(index, 'operator', e.target.value as OperatorEnum)
                    }
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    <option value="gt">&gt; (Greater Than)</option>
                    <option value="lt">&lt; (Less Than)</option>
                    <option value="eq">= (Equal To)</option>
                    <option value="gte">&gt;= (Greater or Equal)</option>
                    <option value="lte">&lt;= (Less or Equal)</option>
                  </select>

                  <input
                    type="number"
                    required
                    value={condition.value}
                    onChange={e => updateCondition(index, 'value', Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />

                  {formData.conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alert Message
              </label>
              <textarea
                required
                value={formData.alertMessage}
                onChange={e => setFormData({ ...formData, alertMessage: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                placeholder="Alert text when rule triggers"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rules.map(rule => (
          <div
            key={rule._id}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border ${
              rule.isEnabled
                ? 'border-gray-200 dark:border-gray-700'
                : 'border-dashed border-gray-300 dark:border-gray-600 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rule.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${rule.isEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}
                >
                  {rule.isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex gap-2 text-gray-400">
                <button
                  onClick={() => editRule(rule)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="hover:text-red-600 dark:hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Conditions ({rule.conditions?.length || 0}):
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 pl-4 list-disc">
                {rule.conditions?.map((cond, idx) => (
                  <li key={idx}>
                    {cond.source}: {cond.parameter} {cond.operator} {cond.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Alert Message:
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200">{rule.alertMessage}</p>
            </div>
          </div>
        ))}
        {rules.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <BrainCircuit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Prediction Rules
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first rule to start getting alerts.
            </p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                Create Rule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
