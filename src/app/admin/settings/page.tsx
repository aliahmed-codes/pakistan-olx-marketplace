'use client';

import { useState, useEffect } from 'react';
import { Save, DollarSign, Building2, CreditCard, User, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface BankDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode: string;
}

interface SiteConfig {
  featuredAdPrice: number;
  featuredAdDuration: number;
  commissionEnabled: boolean;
  commissionPercentage: number;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchCode: '',
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    featuredAdPrice: 2000,
    featuredAdDuration: 7,
    commissionEnabled: false,
    commissionPercentage: 2,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [bankRes, configRes] = await Promise.all([
        fetch('/api/bank-details'),
        fetch('/api/admin/config'),
      ]);

      const bankData = await bankRes.json();
      const configData = await configRes.json();

      if (bankData.success) {
        setBankDetails(bankData.data.bankDetails);
      }

      if (configData.success) {
        setSiteConfig(configData.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveBankDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/bank-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankDetails),
      });

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Bank details have been updated successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save bank details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Site configuration has been updated successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage site settings and configurations</p>
      </div>

      <Tabs defaultValue="bank" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        {/* Bank Details */}
        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Account Details
              </CardTitle>
              <CardDescription>
                These details will be shown to users when they want to feature their ads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, bankName: e.target.value })
                    }
                    placeholder="e.g., Habib Bank Limited"
                  />
                </div>
                <div>
                  <Label htmlFor="accountTitle">Account Title</Label>
                  <Input
                    id="accountTitle"
                    value={bankDetails.accountTitle}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, accountTitle: e.target.value })
                    }
                    placeholder="e.g., Pakistan Marketplace Pvt Ltd"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                    }
                    placeholder="e.g., 12345678901"
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={bankDetails.iban}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, iban: e.target.value })
                    }
                    placeholder="e.g., PK36HABB000012345678901"
                  />
                </div>
                <div>
                  <Label htmlFor="branchCode">Branch Code (Optional)</Label>
                  <Input
                    id="branchCode"
                    value={bankDetails.branchCode}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, branchCode: e.target.value })
                    }
                    placeholder="e.g., 0123"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveBankDetails}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Bank Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Featured Ad Pricing
              </CardTitle>
              <CardDescription>
                Set the price and duration for featured ads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="featuredPrice">Featured Ad Price (Rs)</Label>
                  <Input
                    id="featuredPrice"
                    type="number"
                    value={siteConfig.featuredAdPrice}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        featuredAdPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="featuredDuration">Duration (Days)</Label>
                  <Input
                    id="featuredDuration"
                    type="number"
                    value={siteConfig.featuredAdDuration}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        featuredAdDuration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveConfig}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Pricing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission */}
        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Commission Settings
              </CardTitle>
              <CardDescription>
                Configure commission settings for sold items (2% commission feature)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-yellow-800">Enable Commission</h4>
                  <p className="text-sm text-yellow-600">
                    When enabled, users will be charged a commission when they mark an ad as sold
                  </p>
                </div>
                <Switch
                  checked={siteConfig.commissionEnabled}
                  onCheckedChange={(checked) =>
                    setSiteConfig({ ...siteConfig, commissionEnabled: checked })
                  }
                />
              </div>

              {siteConfig.commissionEnabled && (
                <div>
                  <Label htmlFor="commissionPercentage">Commission Percentage (%)</Label>
                  <Input
                    id="commissionPercentage"
                    type="number"
                    min={0}
                    max={100}
                    value={siteConfig.commissionPercentage}
                    onChange={(e) =>
                      setSiteConfig({
                        ...siteConfig,
                        commissionPercentage: parseFloat(e.target.value),
                      })
                    }
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Users will pay {siteConfig.commissionPercentage}% of the selling price as commission
                  </p>
                </div>
              )}

              {siteConfig.commissionEnabled && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
                  <ol className="list-decimal list-inside text-sm text-blue-600 space-y-1">
                    <li>User posts an ad and accepts the commission agreement</li>
                    <li>User receives our bank details for future payment</li>
                    <li>When user marks the ad as sold, they must pay the commission</li>
                    <li>User uploads payment proof before completing the sale</li>
                  </ol>
                </div>
              )}

              <Button
                onClick={handleSaveConfig}
                disabled={isLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Commission Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
