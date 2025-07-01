// src/components/projectDataMain.ts
// Purpose: holds all the text-based content for your project brief in a consistent, dynamic structure.
// cspell:disable

export const projectDataMain = {
  developer: {
    name: "Juan Francisco Marcenaro A.",
    role: "Full-stack Web Developer & Digital Solutions Provider",
    specialization: "Building modern, business-focused websites with booking systems and payment integrations"
  },

  client: {
    companyName: "Serena Cleaning Services",
    businessType: "Professional cleaning and detailing company for residential, marine, and automotive properties",
    services: [
      "Yacht & Boat Detailing",
      "Car & Truck Detailing",
      "Residential Cleaning",
      "Pressure Washing",
      "Commercial Properties",
      "General Maintenance"
    ]
  },

  projectUnderstanding: {
    currentNeeds: [
      "Create professional online booking system with deposit collection",
      "Showcase premium yacht and car detailing services",
      "Enable monthly maintenance package subscriptions",
      "Implement secure payment processing",
      "Streamline customer communication channels"
    ],
    mainGoals: [
      "Reduce booking cancellations through deposit system",
      "Increase high-margin service bookings",
      "Automate scheduling and payment collection",
      "Build trust through professional online presence"
    ],
    businessContext: "Serena Cleaning Services is establishing itself as the premier choice for professional cleaning and detailing services, with a special focus on yacht and car detailing. The business needs a professional website that not only showcases their expertise but also streamlines the booking process and protects against cancellations through a deposit system."
  },

  developmentSolution: {
    coreFeatures: [
      {
        title: "Premium Service Showcase",
        description: "Dedicated sections highlighting yacht and car detailing services with professional imagery and detailed service descriptions.",
        technicalDetails: "Optimized image galleries, service comparison tables, and detailed process breakdowns",
        businessBenefit: "Attract high-value clients for premium services"
      },
      {
        title: "Smart Booking System",
        description: "Online booking system with integrated calendar and refundable deposit collection.",
        technicalDetails: "Calendar integration with Stripe for secure deposit handling",
        businessBenefit: "Reduce no-shows and secure advance commitments"
      },
      {
        title: "Subscription Management",
        description: "Monthly maintenance package system with online enrollment and payment processing.",
        technicalDetails: "Automated recurring billing and subscription management",
        businessBenefit: "Generate stable recurring revenue"
      },
      {
        title: "Client Communication Hub",
        description: "Integrated WhatsApp button, contact forms, and instant quote calculator.",
        technicalDetails: "WhatsApp Business API integration and custom form development",
        businessBenefit: "Streamline client communications and response time"
      },
      {
        title: "Performance Optimization",
        description: "Lightning-fast website with modern animations and seamless responsive design.",
        technicalDetails: "Advanced optimization techniques, modern animations, responsive design principles",
        businessBenefit: "Exceptional user experience across all devices"
      },
      {
        title: "SEO Enhancement",
        description: "Built-in SEO optimization to improve search engine visibility.",
        technicalDetails: "Metadata optimization, performance optimization, semantic HTML structure",
        businessBenefit: "Improved online visibility and organic traffic"
      }
    ],
    businessBenefits: [
      "Secure advance deposits to reduce cancellations",
      "Showcase premium services for higher revenue",
      "Enable 24/7 online booking capability",
      "Streamline monthly maintenance subscriptions",
      "Professional brand presentation to high-end clients",
      "Improved search engine rankings",
      "Fast-loading, responsive design for all devices"
    ],
    optionalFeatures: [
      "Professional logo redesign",
      "Customer portal for subscription management",
      "Service package comparison tool",
      "Automated review collection system",
      "AI-Generated visuals for service showcase",
      "Advanced analytics dashboard"
    ]
  },

  implementation: {
    timeline: [
      {
        phase: "Design and Planning",
        duration: "1 week",
        deliverables: [
          "Website design mockups",
          "Logo design (if needed)",
          "Content structure",
          "Booking system wireframes"
        ],
        milestones: [
          "Design approval",
          "Logo finalization",
          "Content organization complete"
        ]
      },
      {
        phase: "Core Development",
        duration: "2 weeks",
        deliverables: [
          "Responsive website development",
          "Booking system integration",
          "Payment processing setup",
          "WhatsApp integration"
        ],
        milestones: [
          "Core functionality complete",
          "Payment system tested",
          "Mobile responsiveness verified"
        ]
      },
      {
        phase: "Final Implementation",
        duration: "1 week",
        deliverables: [
          "Testing and refinements",
          "Content population",
          "SEO optimization",
          "Launch preparation"
        ],
        milestones: [
          "All features tested",
          "Content approved",
          "Website launched"
        ]
      }
    ],
    totalDuration: "4 weeks"
  },

  investment: {
    totalCost: 350,
    paymentSchedule: [
      {
        percentage: 100,
        amount: 350,
        milestone: "Project Start (upfront due to special discount"
      },
    ],
    packageIncludes: [
      "Custom website design and development",
      "Stripe payment gateway integration",
      "Online booking system with deposit handling",
      "Mobile-responsive design",
      "WhatsApp business integration",
      "Modern animations and transitions",
      "SEO optimization setup",
      "Performance optimization",
      "3 months technical support",
      "Training session for website management"
    ],
    support: {
      duration: "1 basic courtesy month",
      includes: [
        "Technical support and maintenance",
        "Content updates assistance",
        "Bug fixes and system monitoring",
        "Payment system support"
      ]
    },
    maintenancePlans: {
      basic: {
        price: "20-50",
        name: "Basic Maintenance",
        features: [
          "Hosting and uptime monitoring",
          "Minor updates (text changes, small tweaks)",
          "Regular backups to prevent data loss"
        ]
      },
      standard: {
        price: "50-100",
        name: "Standard Maintenance",
        features: [
          "Everything in Basic tier",
          "Periodic content updates",
          "SEO adjustments",
          "Performance monitoring and optimization"
        ]
      },
      premium: {
        price: "100+",
        name: "Premium Maintenance",
        features: [
          "Everything in Standard tier",
          "Monthly analytics reports",
          "Unlimited small updates",
          "Priority support",
          "Advanced SEO optimization"
        ]
      }
    }
  },

  clientRequirements: {
    requiredInputs: [
      "Existing logo file or approval for new design",
      "Detailed service descriptions and pricing",
      "Professional photos of completed work",
      "Customer testimonials",
      "Monthly package details",
      "Deposit amount specifications"
    ],
    approvalTimelines: [
      "Design mockups: 2 business days",
      "Content review: 3 business days",
      "Final approval: 2 business days"
    ],
    technicalAccess: [
      "Domain access for serena-detail.com",
      "Current logo files (if available)",
      "Social media accounts to link",
      "Existing business assets"
    ]
  },

  nextSteps: {
    immediateActions: [
      "Review and approve proposal",
      "Provide logo files",
      "Share service pricing and package details",
      "Collect customer testimonials",
      "Submit initial payment"
    ],
    timeline: "Project can begin within 48 hours of approval",
    callToAction: {
      heading: "Ready to Transform Your Online Presence?",
      description: "Let's create a professional website that brings in more bookings and streamlines your business operations."
    }
  }
};