'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, DollarSign, Percent, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface BankDetails {
  bankName: string; accountTitle: string;
  accountNumber: string; iban: string; branchCode: string;
}
interface SiteConfig {
  featuredAdPrice: number; featuredAdDuration: number;
  commissionEnabled: boolean; commissionPercentage: number;
}

const TABS = [
  { id: 'bank',       label: 'Bank Details',  icon: Building2 },
  { id: 'pricing',    label: 'Featured Ads',  icon: DollarSign },
  { id: 'commission', label: 'Commission',    icon: Percent },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('bank');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTab, setSavedTab] = useState<string | null>(null);

  const [bank, setBank] = useState<BankDetails>({
    bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '',
  });
  const [config, setConfig] = useState<SiteConfig>({
    featuredAdPrice: 2000, featuredAdDuration: 7,
    commissionEnabled: false, commissionPercentage: 2,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [bankRes, configRes] = await Promise.all([
          fetch('/api/admin/bank-details'),   // ← fixed endpoint
          fetch('/api/admin/config'),
        ]);
        const bankData  = await bankRes.json();
        const configData = await configRes.json();
        if (bankData.success && bankData.data) {
          const d = bankData.data;
          setBank({
            bankName:      d.bankName      || '',
            accountTitle:  d.accountTitle  || '',
            accountNumber: d.accountNumber || '',
            iban:          d.iban          || '',
            branchCode:    d.branchCode    || '',
          });
        }
        if (configData.success) setConfig(configData.data);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const saveBankDetails = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/bank-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bank),
      });
      if (res.ok) {
        toast({ title: 'Bank details saved ✅' });
        setSavedTab('bank');
        setTimeout(() => setSavedTab(null), 2000);
      } else {
        toast({ title: 'Save failed', variant: 'destructive' });
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast({ title: 'Settings saved ✅' });
        setSavedTab(activeTab);
        setTimeout(() => setSavedTab(null), 2000);
      } else {
        toast({ title: 'Save failed', variant: 'destructive' });
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage bank details, pricing, and commission</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-pm text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bank Details */}
      {activeTab === 'bank' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b bg-gray-50/50 rounded-t-2xl">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-pm" /> Bank Account Details
            </CardTitle>
            <CardDescription>Shown to users on the Feature Ad payment page.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'bankName',      label: 'Bank Name',           placeholder: 'e.g. HBL – Habib Bank Limited', key: 'bankName' },
                { id: 'accountTitle',  label: 'Account Title',       placeholder: 'e.g. Pakistan Market (PM)',     key: 'accountTitle' },
                { id: 'accountNumber', label: 'Account Number',      placeholder: '01234567890123',                key: 'accountNumber' },
                { id: 'iban',          label: 'IBAN',                placeholder: 'PK12HABB0012345678901234',      key: 'iban' },
                { id: 'branchCode',    label: 'Branch Code (opt.)', placeholder: '0123',                          key: 'branchCode' },
              ].map((field) => (
                <div key={field.id} className={field.id === 'iban' ? 'md:col-span-2' : ''}>
                  <Label htmlFor={field.id} className="text-xs font-medium text-gray-600">{field.label}</Label>
                  <Input
                    id={field.id}
                    value={(bank as any)[field.key]}
                    onChange={(e) => setBank({ ...bank, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="mt-1 rounded-xl border-gray-200"
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={saveBankDetails}
              disabled={isSaving}
              className="gap-2 bg-pm hover:bg-pm-light rounded-xl"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : savedTab === 'bank' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {savedTab === 'bank' ? 'Saved!' : 'Save Bank Details'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pricing */}
      {activeTab === 'pricing' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b bg-gray-50/50 rounded-t-2xl">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-pm" /> Featured Ad Pricing
            </CardTitle>
            <CardDescription>Price and duration users pay to feature their ads.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Preview card */}
            <div className="bg-gradient-to-br from-pm to-pm-light rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Current Price</p>
                <p className="text-3xl font-extrabold">Rs {config.featuredAdPrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">Duration</p>
                <p className="text-2xl font-bold">{config.featuredAdDuration} days</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fPrice" className="text-xs font-medium text-gray-600">Price (Rs)</Label>
                <Input
                  id="fPrice"
                  type="number"
                  value={config.featuredAdPrice}
                  onChange={(e) => setConfig({ ...config, featuredAdPrice: parseInt(e.target.value) || 0 })}
                  className="mt-1 rounded-xl border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="fDuration" className="text-xs font-medium text-gray-600">Duration (Days)</Label>
                <Input
                  id="fDuration"
                  type="number"
                  value={config.featuredAdDuration}
                  onChange={(e) => setConfig({ ...config, featuredAdDuration: parseInt(e.target.value) || 1 })}
                  className="mt-1 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <Button onClick={saveConfig} disabled={isSaving} className="gap-2 bg-pm hover:bg-pm-light rounded-xl">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : savedTab === 'pricing' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {savedTab === 'pricing' ? 'Saved!' : 'Save Pricing'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Commission */}
      {activeTab === 'commission' && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="border-b bg-gray-50/50 rounded-t-2xl">
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="h-4 w-4 text-pm" /> Commission Settings
            </CardTitle>
            <CardDescription>Charge users a commission when they mark their ad as sold.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className={`flex items-center justify-between p-4 rounded-xl border ${config.commissionEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <p className="font-medium text-sm text-gray-900">Enable Commission</p>
                <p className="text-xs text-gray-500 mt-0.5">Users pay {config.commissionPercentage}% when marking an ad as sold</p>
              </div>
              <Switch
                checked={config.commissionEnabled}
                onCheckedChange={(c) => setConfig({ ...config, commissionEnabled: c })}
              />
            </div>
            {config.commissionEnabled && (
              <div>
                <Label htmlFor="commPct" className="text-xs font-medium text-gray-600">Commission Percentage (%)</Label>
                <Input
                  id="commPct"
                  type="number"
                  min={0} max={100} step={0.5}
                  value={config.commissionPercentage}
                  onChange={(e) => setConfig({ ...config, commissionPercentage: parseFloat(e.target.value) || 0 })}
                  className="mt-1 rounded-xl border-gray-200 max-w-[160px]"
                />
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2">How it works</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-blue-600">
                    <li>User posts an ad and agrees to the commission terms</li>
                    <li>When item is sold, user pays {config.commissionPercentage}% via bank transfer</li>
                    <li>User uploads payment screenshot to mark ad as complete</li>
                  </ol>
                </div>
              </div>
            )}
            <Button onClick={saveConfig} disabled={isSaving} className="gap-2 bg-pm hover:bg-pm-light rounded-xl">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : savedTab === 'commission' ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {savedTab === 'commission' ? 'Saved!' : 'Save Commission Settings'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
