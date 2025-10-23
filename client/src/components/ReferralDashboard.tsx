import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, DollarSign, Share2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
}

interface ReferralBonus {
  id: number;
  bonusType: string;
  amount: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Referral {
  id: number;
  refereeId: string;
  commission: string;
  level: number;
  status: string;
  createdAt: string;
}

export function ReferralDashboard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralBonuses, setReferralBonuses] = useState<ReferralBonus[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
    fetchReferralBonuses();
    fetchReferrals();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral-link');
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const fetchReferralBonuses = async () => {
    try {
      const response = await fetch('/api/referral-bonuses');
      if (response.ok) {
        const data = await response.json();
        setReferralBonuses(data);
      }
    } catch (error) {
      console.error('Error fetching referral bonuses:', error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/referrals');
      if (response.ok) {
        const data = await response.json();
        setReferrals(data);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareReferralLink = async () => {
    if (!referralData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join MoneyPro Investment Platform',
          text: 'Join me on MoneyPro and start earning from your investments!',
          url: referralData.referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(referralData.referralLink, "Referral link");
    }
  };

  const totalEarned = referralBonuses
    .filter(bonus => bonus.status === 'paid')
    .reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0);

  const pendingEarnings = referralBonuses
    .filter(bonus => bonus.status === 'pending')
    .reduce((sum, bonus) => sum + parseFloat(bonus.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Referral Program</h2>
        <p className="text-gray-600 mt-2">
          Invite friends and earn commission on their investments. Build your passive income network!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">${pendingEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                <p className="text-2xl font-bold text-gray-900">5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends to earn commission on their investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={referralData?.referralLink || ''}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => copyToClipboard(referralData?.referralLink || '', "Referral link")}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={shareReferralLink} className="bg-purple-600 hover:bg-purple-700">
                Share
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Your referral code:</span>
              <Badge variant="secondary" className="font-mono">
                {referralData?.referralCode}
              </Badge>
              <Button
                onClick={() => copyToClipboard(referralData?.referralCode || '', "Referral code")}
                variant="ghost"
                size="sm"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
          <CardDescription>
            Earn commission on multiple levels of referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Level 1 (Direct Referrals)</p>
                <p className="text-sm text-green-700">People you directly refer</p>
              </div>
              <Badge className="bg-green-600">5% Commission</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Level 2 (Second Level)</p>
                <p className="text-sm text-blue-700">People referred by your referrals</p>
              </div>
              <Badge className="bg-blue-600">2% Commission</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>Your latest referral activity</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No referrals yet</p>
            ) : (
              <div className="space-y-3">
                {referrals.slice(0, 5).map((referral) => (
                  <div key={referral.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Level {referral.level} Referral</p>
                      <p className="text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+${parseFloat(referral.commission).toFixed(2)}</p>
                      <Badge 
                        variant={referral.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {referral.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bonus History */}
        <Card>
          <CardHeader>
            <CardTitle>Bonus History</CardTitle>
            <CardDescription>Your referral bonus earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {referralBonuses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bonuses yet</p>
            ) : (
              <div className="space-y-3">
                {referralBonuses.slice(0, 5).map((bonus) => (
                  <div key={bonus.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{bonus.bonusType.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{bonus.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(bonus.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+${parseFloat(bonus.amount).toFixed(2)}</p>
                      <Badge 
                        variant={bonus.status === 'paid' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {bonus.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">1. Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral link with friends and family
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">2. They Join & Invest</h3>
              <p className="text-sm text-gray-600">
                When they sign up and make investments, you earn commission
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">3. Earn Commission</h3>
              <p className="text-sm text-gray-600">
                Receive instant commission payments to your account balance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}