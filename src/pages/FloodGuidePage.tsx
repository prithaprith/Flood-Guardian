import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Shield,
  Package,
  Users,
  Home,
  Phone,
  Droplets,
  Car,
  Baby,
  BatteryCharging,
  Radio,
  FileText,
  DollarSign,
  Power,
  Heart,
  HelpCircle,
  Smile,
  Anchor
} from 'lucide-react';

const FloodGuidePage = () => {
  const navigate = useNavigate();

  const guideData = {
    beforeFlood: [
      {
        icon: Package,
        title: 'Emergency Kit Essentials',
        items: [
          'Water (1 gallon per person per day for 3 days)',
          'Water purification tablets',
          'Non-perishable food for 3 days',
          'Medications (7-day supply)',
          'First aid kit',
          'Personal hygiene items'
        ]
      },
      {
        icon: BatteryCharging,
        title: 'Gadgets & Tools',
        items: [
          'Fire starter',
          'Flashlight and extra batteries',
          'Fully charged powerbank',
          'Battery-powered radio'
        ]
      },
      {
        icon: FileText,
        title: 'Documents & Cards',
        items: [
          'Important documents (waterproof container)',
          'Cash and credit cards',
          'Emergency contact information'
        ]
      },
      {
        icon: Baby,
        title: 'Supplies (If Applicable)',
        items: [
          "Baby supplies",
          "Livestock's supplies"
        ]
      },
      {
        icon: Home,
        title: 'Prepare Your Home',
        items: [
          'Know your evacuation routes',
          'Clear storm drains and gutters',
          'Install sump pumps and backup power',
          'Use waterproof sheeting and sealants on basement walls and entryways',
          'Keep sandbags on hand, place it on toilets and drains if necessary',
          'Keep rubber boots',
          'Elevate utilities especially electronics above potential flood levels',
          'Secure loose outdoor items',
          'Anchor fuel tanks',
          'Keep chemicals in waterproof bags',
          'Practice your evacuation plan with everybody in the home'
        ]
      }
    ],
    duringFlood: [
      {
        icon: AlertTriangle,
        title: 'Safety First',
        items: [
          'Move to higher ground immediately',
          'Never walk through flowing water',
          'Avoid bridges over fast-moving water',
          'Never climb into anything closed',
          'Wear sturdy shoes',
          'Use insect repellent',
          'Stay away from downed power lines',
          'Listen to emergency broadcasts',
          'Turn off utilities if instructed',
          'DO NOT DRINK FLOOD WATER',
          'Signal for help if trapped'
        ]
      },
      {
        icon: Car,
        title: 'If Driving',
        items: [
          'Turn around - Don\'t drown',
          '6 inches of water can stall your car',
          '12 inches can carry away your vehicle',
          'If trapped, abandon your car and move to higher ground',
          'Call for help and wait for rescue',
          'Stay with your vehicle if safe'
        ]
      },
      {
        icon: Anchor,
        title: 'If Boating',
        items: [
          'Avoid boating in floodwaters',
          'Wear life jacket at all times, if available',
          'Avoid fast-moving currents and submerged objects',
          'Keep emergency supplies onboard',
          'DO NOT OVERLOAD THE BOAT',
          'Have a float plan'
        ]
      }
    ],
    afterFlood: [
      {
        icon: Shield,
        title: 'Personal Safety',
        items: [
          'Avoid flood water - it may be contaminated',
          'Wait for authorities to say it\'s safe to return',
          'Throw away contaminated food',
          'Avoid open wounds exposure',
          'Clean and disinfect everything'
        ]
      },
      {
        icon: Home,
        title: 'Home Safety',
        items: [
          'Check for gas leaks',
          'Avoid using wet electrical appliances',
          'Ventilate your home',
          'Dispose of soaked insulation & drywall',
          'Test drinking water',
          'Document damage with photos',
          'Contact your insurance company'
        ]
      },
      {
        icon: Phone,
        title: 'Immediate Recovery',
        items: [
          'Contact family and let them know you\'re safe',
          'Visit relief centers',
          'Meet with doctors or health workers',
          'Apply for disaster assistance'
        ]
      },
      {
        icon: Smile,
        title: 'Mental & Community Wellbeing',
        items: [
          'Take care of your mental health',
          'Help your neighbours',
          'Watch for signs of stress and trauma',
          'Take breaks during cleanup'
        ]
      },
      {
        icon: HelpCircle,
        title: 'Long-Term Resilience',
        items: [
          'Learn from the experience',
          'Update your emergency plan',
          'Explore mitigation grants',
          'Consider rebuilding with flood-resistant materials'
        ]
      }
    ]
  };

  const warningTips = [
    {
      icon: Droplets,
      title: 'Water Safety',
      description: 'Just 6 inches of moving water can knock you down. 12 inches can carry away a vehicle.'
    },
    {
      icon: AlertTriangle,
      title: 'Never Drive Through Floods',
      description: 'Most flood deaths occur in vehicles. Turn around, don\'t drown!'
    },
    {
      icon: Phone,
      title: 'Emergency Contacts',
      description: 'Keep emergency numbers accessible. Cell towers may be down during floods.'
    }
  ];

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}> <ArrowLeft className="h-6 w-6 mr-2" /> Back </Button>
        <h1 className="text-2xl font-bold flex items-center"> <BookOpen className="h-7 w-7 mr-2 text-primary" /> Flood Safety Guide </h1>
        <div className="w-20" />
      </div>

      {/* Warning Tips */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {warningTips.map((tip, index) => (
          <Card key={index} className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <tip.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">{tip.title}</h3>
                  <p className="text-sm text-amber-700">{tip.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="before" className="mb-20">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="before" className="text-sm">Before Flood</TabsTrigger>
          <TabsTrigger value="during" className="text-sm">During Flood</TabsTrigger>
          <TabsTrigger value="after" className="text-sm">After Flood</TabsTrigger>
        </TabsList>

        {['before', 'during', 'after'].map((phase, phaseIndex) => (
          <TabsContent key={phaseIndex} value={phase} className="space-y-6">
            {guideData[`${phase}Flood`].map((section, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className={`font-semibold text-lg mb-4 flex items-center`}>
                    <section.icon className={`h-6 w-6 mr-2 ${phase === 'before' ? 'text-blue-500' : phase === 'during' ? 'text-red-500' : 'text-green-500'}`} />
                    {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 ${phase === 'before' ? 'bg-blue-500' : phase === 'during' ? 'bg-red-500' : 'bg-green-500'} rounded-full mt-2 flex-shrink-0`} />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Emergency Action */}
      <Card className="bg-red-50 border-red-200 mb-4">
        <CardContent className="p-4">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800 font-semibold mb-2">Emergency Situation?</p>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => navigate('/chat')}>
              Get Immediate Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloodGuidePage;
