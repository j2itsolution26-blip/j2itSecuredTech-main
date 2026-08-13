/**
 * Static company facts and navigation structure.
 *
 * Values here act as the fallback layer for `SiteSetting` records — an
 * administrator can override contact details at runtime without a redeploy.
 */
export const COMPANY_INFO = {
  name: 'J2 SecureTech',
  legalName: 'J2 SecureTech IT Solutions Inc.',
  tagline: 'Innovate. Secure. Empower.',
  fullTagline: 'Innovating Technology. Securing Systems. Empowering People.',
  description:
    'J2 SecureTech is an integrated IT, cybersecurity, electronics and technology solutions provider — combining software and system development, IoT and automation, IT infrastructure and networking, cybersecurity, CCTV and security systems, telephone and communication systems, electronics and board-level repair, and TESDA-aligned technical training under one accountable team.',
  shortDescription:
    'Enterprise software, secure networks, cybersecurity and surveillance infrastructure — engineered, installed and maintained by one accountable team.',
  founded: 2016,
  // Displayed in local form; `telHref`/`toE164` convert to +63 for dialling
  // and structured data.
  phone: '0955 557 3319',
  phoneAlt: '0955 376 4766',
  // Single operating mailbox. These stay separate fields so each can be
  // pointed at a dedicated address later from Admin -> Settings, with no
  // redeploy; the contact page collapses duplicates when they match.
  email: 'j2itsolution26@gmail.com',
  salesEmail: 'j2itsolution26@gmail.com',
  supportEmail: 'j2itsolution26@gmail.com',
  careersEmail: 'j2itsolution26@gmail.com',
  address: 'Suite 1204, Enterprise Cyber Tower, Tech Hub District, Metro Manila, Philippines',
  addressParts: {
    street: 'Suite 1204, Enterprise Cyber Tower',
    locality: 'Metro Manila',
    region: 'NCR',
    postalCode: '1605',
    country: 'PH',
  },
  geo: { latitude: 14.5547, longitude: 121.0244 },
  mapQuery: 'Enterprise Cyber Tower, Metro Manila, Philippines',
  hours: 'Monday – Friday: 8:00 AM – 6:00 PM PHT',
  hoursDetailed: [
    { days: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { days: 'Saturday', time: '9:00 AM – 1:00 PM' },
    { days: 'Sunday & Holidays', time: 'Emergency support only' },
  ],
  emergencyNote: '24/7 emergency response is included with every Annual Maintenance Contract.',
  keywords: [
    'Enterprise Software Development',
    'Custom Business Systems',
    'Website Development Philippines',
    'E-Commerce Development',
    'IoT Development Philippines',
    'Arduino & ESP32 Automation',
    'Cybersecurity Solutions Philippines',
    'Vulnerability Assessment',
    'CCTV Installation Philippines',
    'Biometric Systems',
    'Network Infrastructure',
    'Structured Cabling',
    'Fiber Optic Installation',
    'IP Telephony & VoIP',
    'Electronics Repair Services',
    'Board-Level Repair',
    'IT Solutions Philippines',
    'System Integration & Automation',
    'TESDA Technical Training',
    'CSS NC II & EPAS NC II',
    'Cybersecurity Training',
  ],
  social: {
    facebook: 'https://facebook.com/j2securetech',
    linkedin: 'https://linkedin.com/company/j2securetech',
    twitter: 'https://twitter.com/j2securetech',
    github: 'https://github.com/j2securetech',
  },
} as const;

/**
 * The company commitment statement, rendered on the About page and echoed as a
 * band on the home page. Kept here so both surfaces stay identical.
 */
export const COMMITMENT = {
  headline: `At ${COMPANY_INFO.name}, we don’t just provide technology—we provide solutions.`,
  body: 'We combine software development, IT infrastructure, networking, cybersecurity, IoT, and electronics expertise to deliver technology solutions that are practical, secure, scalable, and tailored to our clients’ needs.',
  scope:
    'Whether you are looking to develop a customized system, build a secure network, protect your organization from cyber threats, install a CCTV system, automate a process, repair electronic equipment, or train your personnel, J2 SecureTech is ready to help turn your technology needs into effective solutions.',
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  children?: { label: string; href: string; description: string; icon: string }[];
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'Software & System Development',
        href: '/services/software-development',
        description: 'Websites, custom applications and management systems',
        icon: 'Code2',
      },
      {
        label: 'IoT & Automation',
        href: '/services/iot-automation-solutions',
        description: 'Arduino, ESP32, robotics and smart monitoring systems',
        icon: 'Radio',
      },
      {
        label: 'IT Infrastructure & Network',
        href: '/services/network-infrastructure',
        description: 'Network design, servers, firewalls and optimisation',
        icon: 'Network',
      },
      {
        label: 'Cybersecurity',
        href: '/services/cybersecurity-solutions',
        description: 'Detection, monitoring, assessment and hardening',
        icon: 'ShieldAlert',
      },
      {
        label: 'CCTV & Security Systems',
        href: '/services/cctv-installation',
        description: 'IP cameras, monitoring and security integration',
        icon: 'ShieldCheck',
      },
      {
        label: 'Telephone & Communication',
        href: '/services/telephone-communication-systems',
        description: 'Telephone systems, VoIP and intercom',
        icon: 'Phone',
      },
      {
        label: 'Electronics & Board-Level',
        href: '/services/electronics-board-level-repair',
        description: 'Board-level diagnostics and component repair',
        icon: 'CircuitBoard',
      },
      {
        label: 'Technology Training',
        href: '/services/technology-training-seminars',
        description: 'Seminars and workshops for teams and institutions',
        icon: 'GraduationCap',
      },
      {
        label: 'TESDA Technical Training',
        href: '/services/tesda-technical-training',
        description: 'CSS NC II, EPAS NC II and Java Programming NC III',
        icon: 'Award',
      },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Industries', href: '/industries' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAV = {
  services: [
    { label: 'Software & System Development', href: '/services/software-development' },
    { label: 'IoT & Automation', href: '/services/iot-automation-solutions' },
    { label: 'IT Infrastructure & Network', href: '/services/network-infrastructure' },
    { label: 'Cybersecurity', href: '/services/cybersecurity-solutions' },
    { label: 'CCTV & Security Systems', href: '/services/cctv-installation' },
    { label: 'Telephone & Communication', href: '/services/telephone-communication-systems' },
    { label: 'Electronics & Board-Level', href: '/services/electronics-board-level-repair' },
    { label: 'Technology Training', href: '/services/technology-training-seminars' },
    { label: 'TESDA Technical Training', href: '/services/tesda-technical-training' },
    { label: 'All Services', href: '/services' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Industries', href: '/industries' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Contact', href: '/contact' },
    { label: 'Request a Quote', href: '/request-quote' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
} as const;

export const STATS = [
  { value: 250, suffix: '+', label: 'Enterprise projects delivered' },
  { value: 99.9, suffix: '%', label: 'Infrastructure uptime SLA', decimals: 1 },
  { value: 120, suffix: '+', label: 'Active corporate clients' },
  { value: 15, suffix: '+', label: 'Years of combined expertise' },
] as const;

export const TRUSTED_SECTORS = [
  { name: 'Government & LGUs', icon: 'Landmark' },
  { name: 'Healthcare Networks', icon: 'Stethoscope' },
  { name: 'Universities', icon: 'GraduationCap' },
  { name: 'Hospitality Groups', icon: 'Hotel' },
  { name: 'Retail Chains', icon: 'ShoppingBag' },
  { name: 'Logistics & Warehousing', icon: 'Boxes' },
  { name: 'Manufacturing', icon: 'Factory' },
  { name: 'Construction', icon: 'Building2' },
] as const;

/** Differentiators rendered on the home page and About page. */
export const VALUE_PROPS = [
  {
    title: 'Single accountable partner',
    description:
      'Software, cabling, surveillance and electronics delivered by one team — no finger-pointing between vendors when something needs fixing.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Engineering-led delivery',
    description:
      'Certified engineers scope every project on site. Designs are documented, reviewed and handed over with as-built drawings.',
    icon: 'Cpu',
  },
  {
    title: 'Enterprise security posture',
    description:
      'Role-based access, encrypted transport, audit trails and hardened firewalls are standard on every deployment we ship.',
    icon: 'Lock',
  },
  {
    title: 'Measured performance',
    description:
      'We commit to written SLAs — 95+ Lighthouse scores on web builds and four-hour response windows on maintenance contracts.',
    icon: 'Gauge',
  },
  {
    title: 'Procurement ready',
    description:
      'Complete bid documentation, warranty terms and compliance paperwork for government and institutional tenders.',
    icon: 'FileCheck',
  },
  {
    title: 'Support that continues',
    description:
      'Annual maintenance contracts cover preventive checks, patching, backup verification and emergency dispatch.',
    icon: 'Headset',
  },
] as const;

export const DELIVERY_PROCESS = [
  {
    step: '01',
    title: 'Discovery & site survey',
    description:
      'We audit your existing systems, interview stakeholders and survey the premises to establish real constraints before any design work begins.',
  },
  {
    step: '02',
    title: 'Architecture & proposal',
    description:
      'You receive a documented solution architecture, bill of materials, delivery schedule and fixed commercial proposal.',
  },
  {
    step: '03',
    title: 'Build & integration',
    description:
      'Development runs in two-week increments with staging access, while field teams execute cabling and hardware installation to schedule.',
  },
  {
    step: '04',
    title: 'Testing & handover',
    description:
      'Acceptance testing, security review, staff training and as-built documentation are completed before sign-off.',
  },
  {
    step: '05',
    title: 'Support & optimisation',
    description:
      'Maintenance contracts cover monitoring, patching, preventive servicing and a guaranteed response window.',
  },
] as const;

/** Fallback service taxonomy used by the quote form's service selector. */
export const SERVICE_OPTIONS = [
  'Website Development',
  'Custom System & Application Development',
  'Database & Information Management System',
  'Business or School Management System',
  'System Integration & Automation',
  'IoT System Development',
  'Smart Monitoring & Automation System',
  'Arduino / ESP32 / Microcontroller Project',
  'Robotics & Embedded Systems',
  'IT Infrastructure Design & Implementation',
  'Computer Network Design & Installation',
  'Server Configuration & Administration',
  'Router / Switch / Firewall Configuration',
  'Network Troubleshooting & Optimization',
  'Cybersecurity Detection & Prevention',
  'Vulnerability Assessment',
  'Security Monitoring',
  'Cybersecurity Awareness & Training',
  'CCTV Installation & Configuration',
  'IP Camera & Network CCTV System',
  'Security System Integration',
  'Telephone System Installation',
  'IP Telephony / VoIP Solution',
  'Intercom & Communication System',
  'Electronics Troubleshooting & Repair',
  'Board-Level & Component-Level Repair',
  'Preventive & Corrective Maintenance',
  'Technology Training / Seminar',
  'TESDA Technical Training (CSS/EPAS/Java NC)',
  'Other / Not listed',
] as const;

export const CERTIFICATIONS = [
  'ISO 27001 aligned processes',
  'Cisco certified network engineers',
  'Licensed electronics & communications engineers',
  'Manufacturer-authorised CCTV integrators',
  'Microsoft Azure & AWS trained architects',
  'TESDA-aligned technical training instructors',
] as const;
