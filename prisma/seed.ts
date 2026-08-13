/**
 * Database seed.
 *
 * Populates the catalogue, industry profiles, case studies, articles, FAQs and
 * the initial administrator account. Safe to re-run: every write is an upsert
 * keyed on a natural unique field, so existing records are updated in place
 * rather than duplicated.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import {
  EmploymentType,
  ServiceCategory,
  UserRole,
} from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Configure it in .env before seeding.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const IMAGES = {
  software: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  web: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80',
  cctv: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',
  network: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
  cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  consulting: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80',
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
  campus: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  govt: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const SERVICES = [
  {
    slug: 'software-development',
    title: 'Enterprise Software Development',
    category: ServiceCategory.SOFTWARE,
    icon: 'Code2',
    order: 1,
    isFeatured: true,
    image: IMAGES.software,
    summary:
      'Custom ERP, POS, HRMS, payroll and management systems built around how your organisation actually operates.',
    description: `<p>Off-the-shelf software forces your processes to match its assumptions. We build systems the other way round — starting from your workflows, approval chains and reporting obligations, then designing the data model that supports them.</p>
<h2>How we work</h2>
<p>Development runs in two-week increments against a documented backlog. You get access to a staging environment from the first sprint, so feedback happens while changes are still cheap. Every release ships with migration scripts, rollback steps and updated user documentation.</p>
<h2>Built to be maintained</h2>
<p>Systems are delivered with source code, database schema documentation, an administrator guide and staff training. Role-based access control, audit trails and automated backups are standard rather than optional extras.</p>`,
    features: [
      'Inventory management with multi-warehouse stock control',
      'Point of Sale with offline resilience and shift reconciliation',
      'Payroll compliant with BIR, SSS, PhilHealth and Pag-IBIG reporting',
      'HRMS with biometric attendance integration',
      'School management: enrolment, grading, billing and portals',
      'Hospital information systems with records and billing modules',
      'Warehouse management with barcode and RFID workflows',
      'ERP covering finance, procurement, inventory and reporting',
      'CRM with pipeline tracking and quotation workflows',
    ],
    deliverables: [
      'Documented solution architecture',
      'Source code and database schema ownership',
      'Staging and production environments',
      'Administrator and end-user documentation',
      'On-site staff training',
      'Ninety-day post-launch defect warranty',
    ],
  },
  {
    slug: 'website-development',
    title: 'Website & E-Commerce Development',
    category: ServiceCategory.WEBSITE,
    icon: 'Globe',
    order: 2,
    isFeatured: true,
    image: IMAGES.web,
    summary:
      'Corporate websites, web applications and e-commerce platforms engineered for speed, accessibility and search visibility.',
    description: `<p>A corporate website is infrastructure, not decoration. Ours are built on Next.js with server rendering, image optimisation and aggressive caching, because page speed determines both search ranking and conversion.</p>
<h2>Performance commitment</h2>
<p>We contract to a Lighthouse performance score of 95 or above on production hardware, measured on the live domain rather than a local build. Accessibility is validated against WCAG 2.2 AA before handover.</p>
<h2>Commerce that reconciles</h2>
<p>E-commerce builds integrate with your existing inventory or accounting system so stock levels and sales figures agree without manual re-keying.</p>`,
    features: [
      'Corporate and institutional websites',
      'Content management with role-based publishing',
      'Full-stack e-commerce with payment gateway integration',
      'Booking and reservation systems',
      'High-converting campaign landing pages',
      'Progressive web applications',
    ],
    deliverables: [
      'Responsive design across mobile, tablet and desktop',
      'Content management system with training',
      'Technical SEO configuration and sitemap',
      'Analytics and Search Console setup',
      'SSL, security headers and automated backups',
      'Twelve months of hosting support',
    ],
  },
  {
    slug: 'iot-automation-solutions',
    title: 'IoT & Automation Solutions',
    category: ServiceCategory.IOT,
    icon: 'Radio',
    order: 3,
    isFeatured: false,
    image: IMAGES.network,
    summary:
      'Custom IoT platforms, smart monitoring systems and Arduino/ESP32-based automation that turn sensor data into decisions your team can act on.',
    description: `<p>Most "smart" projects stall between a working prototype and a system someone can actually rely on. We take IoT builds through that gap — from microcontroller firmware through to the dashboard a manager checks every morning.</p>
<h2>From prototype to production</h2>
<p>Sensor networks built on Arduino, ESP32 and industrial-grade controllers are engineered for the environment they will actually run in — power interruptions, patchy connectivity and years of unattended operation — not just a bench test.</p>
<h2>Automation that reports back</h2>
<p>Monitoring and control systems feed a central platform with alerting, historical trends and role-based access, so automation is visible and auditable rather than a black box.</p>`,
    features: [
      'IoT platform architecture and sensor network design',
      'Arduino, ESP32 and microcontroller-based device development',
      'Smart monitoring: environmental, energy, occupancy and equipment sensors',
      'Industrial and building automation integration',
      'Robotics and embedded systems development',
      'Custom dashboards with real-time alerting',
      'Edge-to-cloud data pipelines',
    ],
    deliverables: [
      'System architecture and device specification',
      'Firmware and device source code ownership',
      'Monitoring dashboard with administrator access',
      'Device inventory and maintenance guide',
      'Ninety-day post-deployment defect warranty',
    ],
  },
  {
    slug: 'cybersecurity-solutions',
    title: 'Cybersecurity Detection & Prevention',
    category: ServiceCategory.CYBERSECURITY,
    icon: 'ShieldAlert',
    order: 5,
    isFeatured: true,
    image: IMAGES.cctv,
    summary:
      'Vulnerability assessment, security monitoring and endpoint hardening that reduce your actual attack surface, not just your compliance paperwork.',
    description: `<p>Cybersecurity work that only produces a report changes nothing. Every engagement ends with hardened systems and a written record of what was fixed, not just what was found.</p>
<h2>Assessment before action</h2>
<p>We assess network exposure, endpoint configuration and access controls before recommending anything, so remediation targets the risks that actually apply to your environment rather than a generic checklist.</p>
<h2>Monitoring that catches the quiet incidents</h2>
<p>Most breaches are noticed weeks after they start. Continuous monitoring and endpoint protection are configured to surface anomalies while they are still small enough to contain without a public incident.</p>`,
    features: [
      'Vulnerability assessment and penetration testing',
      'Network and system security hardening',
      '24/7 security monitoring and alerting',
      'Endpoint and access security controls',
      'Firewall, IDS/IPS and email security configuration',
      'Cybersecurity awareness training for staff',
      'Incident response planning and tabletop exercises',
    ],
    deliverables: [
      'Written vulnerability assessment with prioritised findings',
      'Hardening checklist applied and verified',
      'Monitoring and alerting configuration documentation',
      'Staff awareness training records',
      'Incident response runbook',
    ],
  },
  {
    slug: 'cctv-installation',
    title: 'CCTV & Biometric Security Systems',
    category: ServiceCategory.SECURITY,
    icon: 'Cctv',
    order: 6,
    isFeatured: true,
    image: IMAGES.cctv,
    summary:
      'IP surveillance, access control and biometric attendance — surveyed, installed, commissioned and maintained.',
    description: `<p>Camera coverage is a design problem before it is a purchasing decision. We survey the site, map sightlines against lighting conditions, then specify sensors and lenses that produce usable footage at the distances that matter.</p>
<h2>Recording and retention</h2>
<p>Storage is sized to your actual retention requirement — typically thirty to ninety days — accounting for frame rate, resolution and motion patterns. Recorders are placed in secured, ventilated locations with UPS protection.</p>
<h2>Access control</h2>
<p>Fingerprint, facial recognition and RFID readers integrate with door hardware and, where required, feed attendance data directly into payroll.</p>`,
    features: [
      'Supply of IP and HD analogue camera hardware',
      'Professional installation and cable management',
      'NVR/DVR configuration and storage sizing',
      'Remote monitoring via mobile and desktop',
      'Biometric access control: fingerprint, face and RFID',
      'Time and attendance integration with payroll',
      'Preventive maintenance and rapid fault response',
    ],
    deliverables: [
      'Site survey report and camera placement plan',
      'Bill of materials with manufacturer warranties',
      'Commissioning tests and footage quality sign-off',
      'As-built drawings and device inventory',
      'Operator training and mobile app setup',
    ],
  },
  {
    slug: 'network-infrastructure',
    title: 'Network Infrastructure & Structured Cabling',
    category: ServiceCategory.NETWORK,
    icon: 'Network',
    order: 4,
    isFeatured: true,
    image: IMAGES.network,
    summary:
      'Fiber backbones, Cat6A structured cabling, server rooms, enterprise Wi-Fi and next-generation firewalls.',
    description: `<p>Most network faults trace back to physical layer shortcuts taken during installation. We certify every run, label both ends, and hand over a patching schedule that still makes sense three years later.</p>
<h2>Design and certification</h2>
<p>Cabling is installed to TIA/EIA standards and certified with calibrated test equipment. You receive the test results, not just an assurance that it works.</p>
<h2>Wireless that holds up</h2>
<p>Wi-Fi is designed from a predictive survey and validated on site after installation, so coverage holds under real user density rather than on paper.</p>`,
    features: [
      'Single-mode and multi-mode fiber splicing and termination',
      'Cat6/Cat6A structured cabling with certification testing',
      'Server rack, cabinet and cable management build-out',
      'High-density enterprise Wi-Fi design and deployment',
      'Next-generation firewall configuration and hardening',
      'Managed switch, router and VLAN configuration',
      'Network monitoring and documented topology',
    ],
    deliverables: [
      'Predictive and post-installation site surveys',
      'Certification test results for every cable run',
      'Rack elevation and patching schedule',
      'Network topology and IP addressing documentation',
      'Firewall policy documentation',
    ],
  },
  {
    slug: 'telephone-communication-systems',
    title: 'Telephone & VoIP Communication Systems',
    category: ServiceCategory.TELEPHONY,
    icon: 'Phone',
    order: 7,
    isFeatured: false,
    image: IMAGES.consulting,
    summary:
      'PABX, IP telephony and intercom systems installed, configured and integrated with the rest of your network infrastructure.',
    description: `<p>Phone systems fail quietly for months before anyone escalates — a queue that never rings through, an extension nobody can reach. We install and configure voice systems the same way we treat data infrastructure: documented, tested and monitored.</p>
<h2>Built on the network, not beside it</h2>
<p>IP telephony shares infrastructure with your data network, so call quality depends on the same QoS configuration, VLAN segmentation and cabling discipline as everything else we install.</p>
<h2>Systems that scale with the organisation</h2>
<p>Extensions, call routing and intercom zones are configured to match your organisational chart today, with headroom documented for the next expansion rather than a rebuild.</p>`,
    features: [
      'PABX and IP-PBX supply, installation and configuration',
      'VoIP solutions with SIP trunk provisioning',
      'Intercom and paging system installation',
      'Call routing, queuing and voicemail configuration',
      'Integration with existing network and communication infrastructure',
      'Handset supply and extension cabling',
    ],
    deliverables: [
      'Call flow and extension directory documentation',
      'QoS and VLAN configuration for voice traffic',
      'System administrator training',
      'Twelve-month workmanship warranty',
    ],
  },
  {
    slug: 'electronics-board-level-repair',
    title: 'Electronics & Board-Level Repair',
    category: ServiceCategory.ELECTRONICS,
    icon: 'CircuitBoard',
    order: 8,
    isFeatured: false,
    image: IMAGES.software,
    summary:
      'Component-level diagnostics and repair for control boards, power supplies and electronic equipment other shops replace instead of fix.',
    description: `<p>A faulty control board is usually one failed component, not a reason to buy a new unit. We diagnose to the component level and repair what can be repaired, which is most of what arrives on the bench.</p>
<h2>Diagnosis before disposal</h2>
<p>Circuit testing identifies the actual point of failure — a blown capacitor, a cracked solder joint, a failed regulator — rather than defaulting to board replacement because tracing the fault takes longer.</p>
<h2>Built to last past the repair</h2>
<p>Preventive maintenance schedules catch the same failure modes before they take equipment down, which costs less than emergency repair and avoids the downtime entirely.</p>`,
    features: [
      'Board-level diagnostics and component-level repair',
      'Power supply and control board troubleshooting',
      'Electronic circuit testing and fault isolation',
      'Preventive and corrective maintenance programmes',
      'Component sourcing and replacement',
      'Equipment refurbishment and calibration',
    ],
    deliverables: [
      'Written diagnostic report before repair authorisation',
      'Repaired unit with functional test results',
      'Parts warranty on replaced components',
      'Maintenance schedule recommendation',
    ],
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions & Migration',
    category: ServiceCategory.CLOUD,
    icon: 'Cloud',
    order: 9,
    isFeatured: true,
    image: IMAGES.cloud,
    summary:
      'Cloud migration, hybrid architecture, managed hosting and disaster recovery planning that survives an actual outage.',
    description: `<p>Cloud migration succeeds or fails on preparation. We audit workloads, identify what should move, what should stay and what should be rebuilt, then sequence the migration so business operations continue throughout.</p>
<h2>Disaster recovery you have tested</h2>
<p>A backup you have never restored is a hypothesis. We define recovery time and recovery point objectives, then rehearse restoration on a schedule and document the results.</p>`,
    features: [
      'Workload assessment and migration planning',
      'Hybrid on-premise and cloud architecture',
      'Managed hosting on AWS, Azure and Vercel',
      'Automated backup and disaster recovery',
      'Microsoft 365 and Google Workspace deployment',
      'Cost optimisation and capacity review',
    ],
    deliverables: [
      'Migration runbook with rollback procedures',
      'Infrastructure documentation and access matrix',
      'Backup schedule with tested restoration',
      'Monthly cost and utilisation reporting',
    ],
  },
  {
    slug: 'it-consultancy',
    title: 'IT Consultancy & Advisory',
    category: ServiceCategory.CONSULTING,
    icon: 'Handshake',
    order: 10,
    isFeatured: false,
    image: IMAGES.consulting,
    summary:
      'Independent technology assessment, procurement support and multi-year IT roadmaps for organisations without an in-house CTO.',
    description: `<p>We are engaged when an organisation needs an independent technical view — before signing a major contract, after inheriting undocumented systems, or when preparing a capital expenditure request.</p>
<h2>What an engagement produces</h2>
<p>A written assessment of your current environment, prioritised risks, a costed remediation plan and, where relevant, technical specifications you can put out to tender.</p>`,
    features: [
      'Infrastructure and security posture assessment',
      'Technology roadmap and budget planning',
      'Vendor-neutral procurement specifications',
      'Bid evaluation and technical scoring support',
      'Business continuity planning',
      'Compliance readiness review',
    ],
    deliverables: [
      'Written assessment report with prioritised findings',
      'Costed remediation roadmap',
      'Procurement-ready technical specifications',
      'Executive presentation for board or budget approval',
    ],
  },
  {
    slug: 'technical-support',
    title: 'Technical Support & Annual Maintenance',
    category: ServiceCategory.SUPPORT,
    icon: 'Headset',
    order: 11,
    isFeatured: false,
    image: IMAGES.consulting,
    summary:
      'Annual maintenance contracts covering preventive servicing, patching, monitoring and guaranteed response windows.',
    description: `<p>Maintenance contracts exist so that faults are found before users report them. Scheduled visits cover physical inspection, firmware and patch updates, backup verification and capacity review.</p>
<h2>Response commitments</h2>
<p>Contracts specify a response window by severity — typically four hours for a system-down incident within business hours, with 24/7 emergency dispatch for critical infrastructure.</p>`,
    features: [
      'Scheduled preventive maintenance visits',
      'Security patching and firmware updates',
      'Backup verification and restore testing',
      'Remote monitoring with proactive alerting',
      'Guaranteed response windows by severity',
      '24/7 emergency dispatch for critical systems',
      'Quarterly service reporting',
    ],
    deliverables: [
      'Service level agreement with defined response windows',
      'Preventive maintenance schedule',
      'Named support contacts and escalation path',
      'Quarterly service and incident reports',
    ],
  },
  {
    slug: 'technology-training-seminars',
    title: 'Technology Training & Professional Development',
    category: ServiceCategory.TRAINING,
    icon: 'GraduationCap',
    order: 12,
    isFeatured: false,
    image: IMAGES.campus,
    summary:
      'Seminars and hands-on workshops in software development, cybersecurity, networking, IoT, robotics and electronics for teams and institutions.',
    description: `<p>Training is only useful if participants can apply it the next working day. Our seminars and workshops are built around hands-on exercises using the same tools and scenarios participants will actually encounter.</p>
<h2>Delivered for the audience, not a generic syllabus</h2>
<p>Content is scoped to the participants' starting level and the organisation's actual technology stack, whether that is a two-day network administration bootcamp or a semester-length partnership with a school's IT programme.</p>`,
    features: [
      'Software and web development training',
      'Cybersecurity and ethical hacking workshops',
      'System and network administration seminars',
      'Internet of Things (IoT) and robotics training',
      'Electronics and computer hardware troubleshooting workshops',
      'Custom in-house training for corporate and institutional teams',
    ],
    deliverables: [
      'Training materials and take-home reference guides',
      'Hands-on lab exercises matched to participant level',
      'Certificate of completion',
      'Post-training support for follow-up questions',
    ],
  },
  {
    slug: 'tesda-technical-training',
    title: 'TESDA Technical Training Programs',
    category: ServiceCategory.TRAINING,
    icon: 'Award',
    order: 13,
    isFeatured: false,
    image: IMAGES.campus,
    summary:
      'TESDA-aligned instruction in Computer Systems Servicing, Electronic Products Assembly and Servicing, and Java Programming, delivered by working practitioners.',
    description: `<p>We deliver technical instruction aligned to TESDA competency standards, taught by people who perform the work professionally rather than instructors teaching purely from a curriculum.</p>
<h2>Skills assessed against a national standard</h2>
<p>Each programme is structured around the official competency-based curriculum, preparing participants for national certification assessment rather than a certificate of attendance alone.</p>`,
    features: [
      'Computer Systems Servicing NC II (CSS NC II)',
      'Electronic Products Assembly and Servicing NC II (EPAS NC II)',
      'Java Programming NC III',
      'Competency-based hands-on instruction',
      'National Certification assessment preparation',
    ],
    deliverables: [
      'Competency-based training aligned to TESDA curriculum standards',
      'Hands-on practical assessment sessions',
      'Certification assessment preparation and guidance',
      'Training completion documentation',
    ],
  },
];

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

const INDUSTRIES = [
  {
    slug: 'government',
    title: 'Government & LGUs',
    icon: 'Landmark',
    order: 1,
    description:
      'Records systems, surveillance and network infrastructure delivered with the documentation and compliance evidence public procurement requires.',
    challenges: [
      'Procurement rules demand fully specified, auditable proposals',
      'Legacy records held in incompatible formats across departments',
      'Public-facing services expected to stay available during office hours',
      'Data privacy obligations under the Data Privacy Act',
    ],
    solutions: [
      'Bid-ready technical specifications and compliance documentation',
      'Records digitisation with role-based access and audit trails',
      'Redundant network design with UPS-backed core equipment',
      'Biometric access control for restricted areas',
    ],
  },
  {
    slug: 'education',
    title: 'Schools & Universities',
    icon: 'GraduationCap',
    order: 2,
    description:
      'Campus-wide connectivity, student information systems and security infrastructure sized for peak enrolment periods.',
    challenges: [
      'Wi-Fi collapsing under simultaneous student load',
      'Enrolment periods creating extreme short-term system demand',
      'Multiple buildings requiring fiber interconnection',
      'Safeguarding obligations around campus monitoring',
    ],
    solutions: [
      'High-density Wi-Fi designed from predictive and validation surveys',
      'Student information systems with online enrolment and portals',
      'Fiber backbone linking buildings with redundant paths',
      'Perimeter and corridor CCTV with retention policy controls',
    ],
  },
  {
    slug: 'healthcare',
    title: 'Hospitals & Healthcare',
    icon: 'Stethoscope',
    order: 3,
    description:
      'Hospital information systems, resilient clinical networks and surveillance built for environments that never close.',
    challenges: [
      'Clinical systems cannot tolerate unplanned downtime',
      'Patient records require strict confidentiality controls',
      'Wireless coverage needed across shielded and dense structures',
      'Equipment must operate continuously without maintenance windows',
    ],
    solutions: [
      'Redundant core network with automatic failover',
      'Hospital information systems with granular access control',
      'Clinical-grade wireless surveyed ward by ward',
      '24/7 monitored CCTV with restricted-area access control',
    ],
  },
  {
    slug: 'hospitality',
    title: 'Hotels & Hospitality',
    icon: 'Hotel',
    order: 4,
    description:
      'Guest connectivity, property management integration and access control that guests never have to think about.',
    challenges: [
      'Guest Wi-Fi expectations equal to home broadband',
      'Property management, POS and door systems from different vendors',
      'Installation work must not disturb occupied rooms',
      'Payment card data handling obligations',
    ],
    solutions: [
      'Per-room access points with bandwidth management',
      'Integration between property management, POS and door locks',
      'Phased installation scheduled around occupancy',
      'Network segmentation isolating payment systems',
    ],
  },
  {
    slug: 'retail',
    title: 'Retail & Supermarkets',
    icon: 'ShoppingBag',
    order: 5,
    description:
      'Multi-branch POS, real-time stock visibility and loss prevention surveillance that produces evidential footage.',
    challenges: [
      'Stock figures diverging between branches and head office',
      'Checkout systems failing during peak trading',
      'Shrinkage difficult to attribute without usable footage',
      'New branches needing rapid, repeatable deployment',
    ],
    solutions: [
      'Centralised POS with offline-capable terminals',
      'Real-time inventory synchronisation across branches',
      'Till-facing cameras with transaction overlay',
      'Standardised branch deployment kit and runbook',
    ],
  },
  {
    slug: 'logistics',
    title: 'Warehouses & Logistics',
    icon: 'Boxes',
    order: 6,
    description:
      'Warehouse management systems, long-range wireless coverage and perimeter security for high-bay environments.',
    challenges: [
      'Wireless coverage defeated by racking and metal structures',
      'Manual stock counts consuming days of labour',
      'Large perimeters with limited natural surveillance',
      'Vehicle movement records needed for dispute resolution',
    ],
    solutions: [
      'Wireless designed for high-bay racking with directional antennas',
      'Barcode and RFID warehouse management with handheld terminals',
      'Perimeter IP cameras with infrared and analytics',
      'Loading bay cameras with number plate capture',
    ],
  },
  {
    slug: 'construction',
    title: 'Construction & Real Estate',
    icon: 'Building2',
    order: 7,
    description:
      'Temporary site connectivity, progress monitoring and permanent infrastructure installed during fit-out.',
    challenges: [
      'Sites requiring connectivity before permanent services exist',
      'Equipment security across open, changing environments',
      'Progress documentation for client and lender reporting',
      'Infrastructure must be installed during narrow fit-out windows',
    ],
    solutions: [
      'Temporary mesh networks with cellular backhaul',
      'Relocatable solar CCTV towers for active sites',
      'Time-lapse and progress monitoring cameras',
      'Structured cabling coordinated with the fit-out programme',
    ],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing & Industrial',
    icon: 'Factory',
    order: 8,
    description:
      'Industrial networks, production floor monitoring and attendance systems built for harsh operating conditions.',
    challenges: [
      'Electrical interference disrupting standard cabling',
      'Production lines that cannot stop for installation work',
      'Shift attendance across large, distributed workforces',
      'Machine data isolated from business reporting systems',
    ],
    solutions: [
      'Shielded and fiber cabling routed away from interference',
      'Installation scheduled around planned production shutdowns',
      'Biometric attendance terminals feeding payroll directly',
      'Segmented industrial networks bridged to reporting systems',
    ],
  },
];

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

const PROJECTS = [
  {
    slug: 'regional-hospital-information-system',
    title: 'Hospital Information System for a 300-Bed Regional Hospital',
    category: 'Enterprise Software',
    client: 'Regional Medical Centre',
    industry: 'Healthcare',
    location: 'Central Luzon',
    thumbnail: IMAGES.hospital,
    isFeatured: true,
    order: 1,
    completedAt: new Date('2025-09-30'),
    summary:
      'Replaced paper records and three disconnected spreadsheets with a single patient record, billing and pharmacy system across eighteen departments.',
    overview: `<p>The hospital operated patient records on paper, billing in a legacy desktop application and pharmacy stock in spreadsheets maintained by individual staff. Reconciling a single patient's charges took two working days.</p><p>We delivered an integrated hospital information system covering admissions, clinical records, pharmacy inventory, laboratory results and billing, deployed department by department over seven months without interrupting clinical operations.</p>`,
    challenge: `<p>Clinical operations could not pause. Records held decades of history in inconsistent formats, and a significant proportion of staff had limited computer experience. The building's network was also unable to support additional load.</p>`,
    solution: `<p>We upgraded the network backbone first, then rolled out the system department by department, starting with admissions. Each department ran parallel paper and digital records for two weeks before cutover. Historical records were digitised in batches, prioritising active patients. On-site trainers worked each shift for the first month.</p>`,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
    features: [
      'Unified patient record across all departments',
      'Admissions, discharge and transfer workflow',
      'Pharmacy inventory with expiry and reorder alerts',
      'Laboratory result capture and clinician notification',
      'Consolidated billing with PhilHealth claim preparation',
      'Role-based access with full audit trail',
    ],
    results: [
      'Patient billing reconciliation reduced from two days to under fifteen minutes',
      'Pharmacy stock discrepancies reduced by 94% within two quarters',
      'PhilHealth claim rejection rate reduced from 18% to 4%',
      'System uptime of 99.97% across the first twelve months',
    ],
    images: [IMAGES.hospital, IMAGES.software],
  },
  {
    slug: 'university-campus-network',
    title: 'Campus-Wide Fiber Network & High-Density Wi-Fi',
    category: 'Network Infrastructure',
    client: 'Private University',
    industry: 'Education',
    location: 'Metro Manila',
    thumbnail: IMAGES.campus,
    isFeatured: true,
    order: 2,
    completedAt: new Date('2025-06-15'),
    summary:
      'Fiber backbone across nine buildings with 240 access points supporting 12,000 concurrent devices during enrolment.',
    overview: `<p>The university's network had grown building by building over fifteen years with no unified design. Enrolment week routinely brought the network down entirely.</p><p>We designed and installed a redundant fiber backbone linking nine buildings, replaced the core and distribution switching, and deployed 240 access points designed from a predictive survey and validated on site.</p>`,
    challenge: `<p>Work had to be completed within the semester break. Several buildings are heritage-listed, restricting cable routing. Peak load during enrolment exceeds normal usage by a factor of six.</p>`,
    solution: `<p>Fiber was routed through existing service ducts where available and surface-mounted in heritage-approved trunking elsewhere. Access points were placed from a predictive survey, then validated with a walk-through survey after installation and adjusted where readings disagreed with the model.</p>`,
    technologies: ['Single-mode fiber', 'Cat6A', 'Managed switching', 'Enterprise Wi-Fi', 'RADIUS', 'Network monitoring'],
    features: [
      'Redundant fiber ring across nine buildings',
      'Core and distribution switch replacement',
      '240 access points with centralised management',
      'RADIUS authentication tied to student records',
      'VLAN segmentation for staff, students and guests',
      'Network monitoring with alerting',
    ],
    results: [
      'Sustained 12,000 concurrent devices through enrolment week with no outage',
      'Average wireless throughput per client increased 5.8×',
      'Support tickets relating to connectivity reduced by 87%',
      'Full certification results delivered for all 1,400 cable runs',
    ],
    images: [IMAGES.campus, IMAGES.network],
  },
  {
    slug: 'warehouse-management-system',
    title: 'Barcode Warehouse Management Across Four Distribution Centres',
    category: 'Enterprise Software',
    client: 'National Logistics Operator',
    industry: 'Logistics',
    location: 'Luzon & Visayas',
    thumbnail: IMAGES.warehouse,
    isFeatured: true,
    order: 3,
    completedAt: new Date('2025-11-20'),
    summary:
      'Barcode-driven receiving, put-away, picking and dispatch across four sites, with wireless coverage rebuilt for high-bay racking.',
    overview: `<p>Stock accuracy sat around 82%, and monthly counts required shutting each facility for a full day. We delivered a warehouse management system with handheld barcode terminals, alongside a wireless network redesigned specifically for high-bay racking.</p>`,
    challenge: `<p>Existing wireless coverage failed between racking aisles, and the operator could not suspend distribution during implementation.</p>`,
    solution: `<p>Directional antennas were mounted along aisle centrelines and validated with a loaded trolley walk-through. The system was rolled out one facility at a time, each running parallel to existing processes for three weeks.</p>`,
    technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'Android handhelds', 'Directional Wi-Fi', 'REST integration'],
    features: [
      'Barcode receiving with purchase order matching',
      'Directed put-away and replenishment',
      'Wave and batch picking with handheld confirmation',
      'Dispatch manifests and proof of delivery capture',
      'Cycle counting replacing full shutdown counts',
      'Integration with the existing accounting system',
    ],
    results: [
      'Stock accuracy improved from 82% to 99.4%',
      'Full-shutdown counts eliminated in favour of rolling cycle counts',
      'Order picking throughput increased 41%',
      'Mis-picks reduced by 76% within the first quarter',
    ],
    images: [IMAGES.warehouse, IMAGES.software],
  },
  {
    slug: 'retail-chain-surveillance',
    title: 'Loss Prevention Surveillance Across 26 Retail Branches',
    category: 'CCTV & Security',
    client: 'Supermarket Chain',
    industry: 'Retail',
    location: 'Nationwide',
    thumbnail: IMAGES.retail,
    isFeatured: false,
    order: 4,
    completedAt: new Date('2025-04-10'),
    summary:
      'Standardised 26-branch IP camera deployment with transaction overlay at every till and centralised remote review.',
    overview: `<p>Each branch had accumulated cameras from different suppliers, with footage quality too poor to support disciplinary or legal action. We standardised on a single platform and rebuilt coverage from a template design applied to each store layout.</p>`,
    challenge: `<p>Twenty-six sites had to be completed within four months without closing any store, and head office required a single interface for reviewing footage across all branches.</p>`,
    solution: `<p>We produced a reference design covering entrances, tills, stockrooms and loading areas, adapted per store. Installation teams worked overnight. Till cameras were integrated with the POS system so transaction data overlays the footage.</p>`,
    technologies: ['IP CCTV', 'NVR', 'POS integration', 'VPN', 'Centralised VMS'],
    features: [
      'Standardised camera template applied per store layout',
      'Transaction overlay on all till-facing cameras',
      'Ninety-day retention at every branch',
      'Centralised remote review across all sites',
      'Motion and loitering analytics on stockroom cameras',
    ],
    results: [
      'Recorded shrinkage reduced 31% within two quarters',
      'Footage quality accepted as evidence in seven cases',
      'Incident review time cut from days to under an hour',
      'All 26 branches completed with no trading hours lost',
    ],
    images: [IMAGES.retail, IMAGES.cctv],
  },
  {
    slug: 'hotel-guest-network',
    title: 'Guest Network and Property System Integration for a Resort Hotel',
    category: 'Network Infrastructure',
    client: 'Resort Hotel Group',
    industry: 'Hospitality',
    location: 'Palawan',
    thumbnail: IMAGES.hotel,
    isFeatured: false,
    order: 5,
    completedAt: new Date('2025-02-28'),
    summary:
      'Per-room wireless coverage, PCI-segmented payment network and integration between property management, POS and door locks.',
    overview: `<p>Guest connectivity complaints were the resort's most common negative review theme. We installed per-room access points, segmented the network, and connected the property management system to POS and door lock platforms that had previously been operated separately.</p>`,
    challenge: `<p>The resort remained at high occupancy throughout. Buildings are spread across landscaped grounds requiring outdoor fiber, and payment systems needed isolation for compliance.</p>`,
    solution: `<p>Work proceeded floor by floor, coordinated with housekeeping schedules so only vacant rooms were touched. Armoured fiber was routed through existing garden service trenches. Payment terminals were placed on an isolated VLAN with firewall rules restricting egress.</p>`,
    technologies: ['Enterprise Wi-Fi', 'Outdoor fiber', 'VLAN segmentation', 'PMS integration', 'Firewall'],
    features: [
      'In-room access points with per-guest bandwidth limits',
      'Outdoor fiber linking all guest buildings',
      'Isolated payment network segment',
      'Property management integration with POS and door locks',
      'Captive portal branded to the resort',
    ],
    results: [
      'Connectivity complaints reduced by 92% within one quarter',
      'Guest review scores for Wi-Fi rose from 2.4 to 4.6 out of 5',
      'Check-in time reduced by an average of 3.5 minutes',
      'Payment segment passed external compliance scanning',
    ],
    images: [IMAGES.hotel, IMAGES.network],
  },
  {
    slug: 'lgu-records-digitisation',
    title: 'Records Digitisation and Biometric Access for a City Government',
    category: 'Enterprise Software',
    client: 'City Government',
    industry: 'Government',
    location: 'Southern Luzon',
    thumbnail: IMAGES.govt,
    isFeatured: false,
    order: 6,
    completedAt: new Date('2024-12-12'),
    summary:
      'Digitised civil registry and permit records with role-based access, biometric entry control and a full audit trail.',
    overview: `<p>Civil registry and business permit records were stored on paper across three buildings, with retrieval taking up to a week. We digitised active records, delivered a records management system with role-based access, and installed biometric access control on the archive rooms.</p>`,
    challenge: `<p>Public service counters had to keep operating throughout. Procurement required fully documented specifications, and personal data handling had to comply with the Data Privacy Act.</p>`,
    solution: `<p>Scanning ran in a dedicated off-site facility with chain-of-custody logging, prioritising the most frequently requested record types. The system enforces role-based access with every record view written to an audit log.</p>`,
    technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'OCR pipeline', 'Biometric access control'],
    features: [
      'Digitised civil registry and permit archives',
      'Full-text search across scanned documents',
      'Role-based access with per-record audit logging',
      'Biometric access control on archive rooms',
      'Certified document issuance workflow',
    ],
    results: [
      'Record retrieval reduced from up to one week to under two minutes',
      'Over 340,000 documents digitised with chain-of-custody records',
      'Counter transaction time reduced by 62%',
      'Passed the annual data privacy compliance review',
    ],
    images: [IMAGES.govt, IMAGES.software],
  },
];

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

const POSTS = [
  {
    slug: 'sizing-cctv-storage-correctly',
    title: 'How to Size CCTV Storage Without Guessing',
    category: 'Security',
    tags: ['CCTV', 'Storage', 'Procurement'],
    featuredImage: IMAGES.cctv,
    readingTime: 7,
    publishedAt: new Date('2026-01-14'),
    excerpt:
      'Retention periods are usually specified before anyone calculates whether the recorder can actually hold that much footage. Here is the arithmetic that should happen first.',
    content: `<p>Most CCTV specifications state a retention period — thirty days is common — without anyone calculating the storage that requires. The result is a recorder that silently overwrites footage a week early, discovered only when someone asks for it.</p>
<h2>The calculation</h2>
<p>Storage per camera per day is bitrate multiplied by seconds in a day, divided by eight to convert bits to bytes. A 4 Mbps camera recording continuously consumes roughly 43 GB per day. Thirty cameras at that rate over thirty days require about 39 TB before any redundancy overhead.</p>
<h2>Where the estimates go wrong</h2>
<p>Three assumptions cause most shortfalls. First, quoted bitrates are usually averages under moderate motion; a camera watching a busy entrance will exceed it. Second, motion-triggered recording saves far less than expected in areas with constant activity. Third, RAID redundancy consumes capacity that is often omitted from the calculation.</p>
<h2>What to specify instead</h2>
<p>State the retention requirement, the recording mode and the expected motion profile per camera zone. Ask the supplier to show the calculation, not just the resulting drive size. Then add 25% headroom, because camera counts always grow.</p>
<h2>Verify after commissioning</h2>
<p>Two weeks after installation, check the oldest available footage against the retention target. If it is already short, the shortfall compounds — address it before it becomes the reason evidence is unavailable.</p>`,
  },
  {
    slug: 'structured-cabling-certification-matters',
    title: 'Why Cable Certification Is Not Optional',
    category: 'Networking',
    tags: ['Cabling', 'Infrastructure', 'Standards'],
    featuredImage: IMAGES.network,
    readingTime: 6,
    publishedAt: new Date('2026-01-28'),
    excerpt:
      'A cable that passes a continuity test can still fail under load. Certification testing is what separates infrastructure from wire.',
    content: `<p>There is a meaningful difference between a cable that carries a signal and a cable that meets its standard. A basic continuity tester confirms the pairs are connected in the right order. It says nothing about whether the run will sustain 10 Gbps.</p>
<h2>What certification actually measures</h2>
<p>A certification tester measures insertion loss, near-end crosstalk, return loss, propagation delay and delay skew across the full frequency range of the category. These are the parameters that determine whether a link performs at rated speed under real traffic.</p>
<h2>The failures certification catches</h2>
<p>Untwisting more than 13 mm at termination, exceeding the bend radius during installation, running data cable alongside power without separation, and cable damaged by over-tightened cable ties. Every one of these passes a continuity test and fails certification.</p>
<h2>Why it matters commercially</h2>
<p>Intermittent physical layer faults are the most expensive category of network problem to diagnose, because the symptoms appear at the application layer. Teams spend days investigating software before anyone suspects a cable installed two years earlier.</p>
<h2>What to require</h2>
<p>Ask for certification results for every run, saved from the tester rather than transcribed. Reputable installers provide this as standard. If a contractor resists, that is informative in itself.</p>`,
  },
  {
    slug: 'erp-implementation-failure-patterns',
    title: 'Five Reasons ERP Implementations Fail (and None Are Technical)',
    category: 'Enterprise Software',
    tags: ['ERP', 'Project Management', 'Change Management'],
    featuredImage: IMAGES.software,
    readingTime: 9,
    publishedAt: new Date('2026-02-11'),
    excerpt:
      'ERP projects rarely fail because the software cannot do the job. They fail for reasons visible months before go-live.',
    content: `<p>After a decade of implementations, the pattern is consistent: the technology is almost never the limiting factor. These are the failure modes that recur.</p>
<h2>1. No single decision-maker</h2>
<p>When every department has veto power and none has authority, scope expands until the timeline collapses. Successful projects have one sponsor who can settle a disagreement in a meeting rather than a committee cycle.</p>
<h2>2. Data migration treated as a final step</h2>
<p>Existing data is always worse than expected — duplicated customers, inconsistent product codes, balances that do not reconcile. Cleansing must start in the first month, not the last.</p>
<h2>3. Configuring around broken processes</h2>
<p>If an approval chain has four redundant steps because of a dispute a decade ago, encoding it into software makes it permanent. Implementation is the moment to remove the step, not enshrine it.</p>
<h2>4. Training scheduled after go-live</h2>
<p>Training two weeks before cutover, on a system users have never seen, guarantees a difficult first month. Give staff access to a staging environment early and let them work through real scenarios.</p>
<h2>5. No plan for the first month</h2>
<p>Go-live is the start of the difficult period, not the end. Budget for on-site support, expect a temporary productivity dip, and hold a fortnightly review for the first quarter.</p>
<h2>The common thread</h2>
<p>Each of these is an organisational decision, not a technical one — which is why choosing better software does not fix them.</p>`,
  },
  {
    slug: 'wifi-design-for-high-density',
    title: 'Designing Wi-Fi for Density, Not Coverage',
    category: 'Networking',
    tags: ['Wi-Fi', 'Design', 'Capacity'],
    featuredImage: IMAGES.campus,
    readingTime: 8,
    publishedAt: new Date('2026-02-25'),
    excerpt:
      'A signal-strength heat map showing full coverage tells you almost nothing about whether 400 people can use the network at once.',
    content: `<p>The most common wireless design error is optimising for coverage when the actual requirement is capacity. A lecture hall with excellent signal strength can still be unusable when 300 students connect simultaneously.</p>
<h2>Coverage and capacity are different problems</h2>
<p>Coverage asks whether a device can hear the access point. Capacity asks how much airtime is available once every device competes for it. Wireless is a shared medium — clients take turns, and slow clients consume disproportionate airtime.</p>
<h2>Design from client count</h2>
<p>Start from the number of concurrent devices per area and the throughput each needs, then work backwards to access point count. In dense environments this usually means more access points at lower transmit power, not fewer at maximum power.</p>
<h2>Reduce cell size deliberately</h2>
<p>Turning power down is counter-intuitive but correct in dense deployments. Smaller cells mean fewer clients per access point and less co-channel interference. Prefer 5 GHz and 6 GHz, which offer more non-overlapping channels.</p>
<h2>Validate after installation</h2>
<p>A predictive survey is a model, and models are wrong in ways that only walls reveal. Validate on site after installation, under load if possible, and adjust placement where measurements disagree with the prediction.</p>`,
  },
  {
    slug: 'choosing-between-cloud-and-on-premise',
    title: 'Cloud or On-Premise: The Questions That Actually Decide It',
    category: 'Cloud',
    tags: ['Cloud', 'Infrastructure', 'Strategy'],
    featuredImage: IMAGES.cloud,
    readingTime: 7,
    publishedAt: new Date('2026-03-10'),
    excerpt:
      'The decision is rarely about cost, despite cost dominating the discussion. These are the factors that should drive it.',
    content: `<p>Cloud versus on-premise is usually argued on price, which is the least reliable basis for the decision. Both models can be cheaper depending on workload shape, and the calculation changes as usage grows.</p>
<h2>Question 1: How variable is the load?</h2>
<p>Workloads with sharp peaks — enrolment periods, seasonal sales — favour cloud, because you pay for the peak only while it lasts. Steady, predictable load often costs less on owned hardware over a three-year horizon.</p>
<h2>Question 2: What happens when connectivity fails?</h2>
<p>If your site loses internet and operations must continue, critical systems belong on-premise or in a hybrid arrangement. A retail branch that cannot process sales during an outage has answered this question.</p>
<h2>Question 3: Who will operate it?</h2>
<p>On-premise infrastructure requires someone to patch, monitor and replace it. Without that capability in-house or under contract, cloud shifts the operational burden to a provider whose job it is.</p>
<h2>Question 4: Where must the data reside?</h2>
<p>Regulatory or contractual requirements sometimes dictate data location. Confirm this before designing, not after.</p>
<h2>Hybrid is a legitimate answer</h2>
<p>Most organisations we advise end up with both: latency-sensitive or connectivity-critical systems on site, everything else in the cloud. That is a considered outcome, not a failure to decide.</p>`,
  },
  {
    slug: 'biometric-attendance-payroll-integration',
    title: 'Integrating Biometric Attendance With Payroll Without Creating Disputes',
    category: 'Enterprise Software',
    tags: ['Biometrics', 'Payroll', 'HRMS'],
    featuredImage: IMAGES.consulting,
    readingTime: 6,
    publishedAt: new Date('2026-03-24'),
    excerpt:
      'Connecting a fingerprint terminal to payroll is straightforward. Handling the edge cases fairly is what determines whether staff trust the result.',
    content: `<p>The technical integration between a biometric terminal and a payroll system takes days. The policy work around it takes considerably longer, and skipping it produces disputes in the first pay cycle.</p>
<h2>Decide the edge cases before go-live</h2>
<p>What happens when a reader fails to recognise a registered employee? When someone forgets to clock out? When a shift crosses midnight? When staff work off-site? Each needs a documented rule and a correction process before the first payroll run.</p>
<h2>Correction must be auditable, not silent</h2>
<p>Manual adjustments are unavoidable. They should require a reason code and supervisor approval, and remain visible in the record. Silent edits destroy trust in the system faster than any hardware fault.</p>
<h2>Run parallel for one full cycle</h2>
<p>Process one complete pay period through both the old and new systems and reconcile the difference before switching. Discrepancies at this stage are cheap; discrepancies after cutover are a dispute.</p>
<h2>Explain what is stored</h2>
<p>Most modern readers store a mathematical template, not a fingerprint image, and the original cannot be reconstructed from it. Saying so plainly, in writing, removes the most common objection.</p>`,
  },
];

// ---------------------------------------------------------------------------
// Testimonials, FAQs, Careers
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    name: 'Dr. Marisa Villanueva',
    role: 'Chief Operating Officer',
    company: 'Regional Medical Centre',
    industry: 'Healthcare',
    rating: 5,
    order: 1,
    isFeatured: true,
    content:
      'They rolled out our hospital information system department by department without a single clinical interruption. The trainers worked our night shifts too, which nobody else offered. Eighteen months on, billing reconciliation that used to take two days takes minutes.',
  },
  {
    name: 'Engr. Rolando Bautista',
    role: 'Director for Information Technology',
    company: 'Private University',
    industry: 'Education',
    rating: 5,
    order: 2,
    isFeatured: true,
    content:
      'Enrolment week used to be the week our network failed. After the fiber and wireless rebuild, we carried twelve thousand devices with no outage. They handed over certification results for all fourteen hundred runs, which our auditors specifically noted.',
  },
  {
    name: 'Karen Lim',
    role: 'Head of Operations',
    company: 'National Logistics Operator',
    industry: 'Logistics',
    rating: 5,
    order: 3,
    isFeatured: true,
    content:
      'Stock accuracy moved from 82% to over 99% and we stopped shutting facilities for monthly counts entirely. What impressed me most was that they fixed the wireless coverage problem first, rather than blaming the handhelds afterwards.',
  },
  {
    name: 'Antonio Reyes',
    role: 'Loss Prevention Manager',
    company: 'Supermarket Chain',
    industry: 'Retail',
    rating: 5,
    order: 4,
    isFeatured: false,
    content:
      'Twenty-six branches in four months without losing a single trading hour. The transaction overlay on the till cameras is what finally gave us footage our lawyers could actually use.',
  },
  {
    name: 'Michelle Santos',
    role: 'General Manager',
    company: 'Resort Hotel Group',
    industry: 'Hospitality',
    rating: 5,
    order: 5,
    isFeatured: false,
    content:
      'Wi-Fi complaints were our worst review theme for two years. They worked around occupancy floor by floor and the complaints effectively stopped. Our connectivity score went from 2.4 to 4.6.',
  },
  {
    name: 'Atty. Ferdinand Cruz',
    role: 'City Administrator',
    company: 'City Government',
    industry: 'Government',
    rating: 5,
    order: 6,
    isFeatured: false,
    content:
      'Their documentation was the most complete of any bidder, which mattered for our procurement process. Records that used to take a week to retrieve now take under two minutes, and we passed our privacy compliance review without findings.',
  },
];

const FAQS = [
  {
    category: 'Services',
    order: 1,
    question: 'What types of custom enterprise software do you build?',
    answer:
      'Inventory and warehouse management, point of sale, payroll and HRMS, school management, hospital information systems, ERP and CRM. Each is built around your existing workflows rather than forcing you to adopt a fixed process.',
  },
  {
    category: 'Services',
    order: 2,
    question: 'Do you supply hardware as well as install it?',
    answer:
      'Yes. We supply cameras, biometric readers, switches, routers, firewalls, server racks, cabling and accessories, all with manufacturer warranties that we administer on your behalf. You can also supply your own hardware and engage us for installation only.',
  },
  {
    category: 'Services',
    order: 3,
    question: 'Can you take over a system another vendor built?',
    answer:
      'Often, yes. We start with an assessment of the existing system, its documentation and its source code availability. We will tell you honestly if maintaining it is more expensive than replacing it.',
  },
  {
    category: 'Projects',
    order: 1,
    question: 'How long does a typical project take?',
    answer:
      'A corporate website takes four to eight weeks. Structured cabling and CCTV for a single site typically takes two to six weeks. Custom enterprise software ranges from three to nine months depending on scope. Every proposal includes a milestone schedule.',
  },
  {
    category: 'Projects',
    order: 2,
    question: 'Do you charge for a site survey?',
    answer:
      'No. Technical surveys for infrastructure and security projects are free and carry no obligation. We survey before quoting because quoting without one produces prices that change later.',
  },
  {
    category: 'Projects',
    order: 3,
    question: 'Will our operations be disrupted during installation?',
    answer:
      'We plan around your operating hours. Retail and hospitality work is usually done overnight, manufacturing during planned shutdowns, and healthcare department by department. Disruption windows are agreed in writing before work starts.',
  },
  {
    category: 'Commercial',
    order: 1,
    question: 'How does your pricing work?',
    answer:
      'Projects are quoted at a fixed price against a defined scope after the survey. Hardware is itemised at supply cost with the margin stated separately. Maintenance contracts are priced annually based on the systems covered and the response window required.',
  },
  {
    category: 'Commercial',
    order: 2,
    question: 'Do you work with government and institutional procurement?',
    answer:
      'Regularly. We provide bid-ready technical specifications, compliance documentation, warranty certificates and the supporting paperwork public procurement requires, and we can attend technical clarification meetings.',
  },
  {
    category: 'Commercial',
    order: 3,
    question: 'Who owns the software you build for us?',
    answer:
      'You do. On full payment you receive ownership of the custom application source code and its documentation. We retain our pre-existing frameworks and tooling, licensed to you perpetually as embedded in the delivered system.',
  },
  {
    category: 'Support',
    order: 1,
    question: 'What is included in an Annual Maintenance Contract?',
    answer:
      'Scheduled preventive maintenance visits, security patching and firmware updates, backup verification with restore testing, remote monitoring, a guaranteed response window by severity, 24/7 emergency dispatch for critical systems, and quarterly service reporting.',
  },
  {
    category: 'Support',
    order: 2,
    question: 'What response times do you commit to?',
    answer:
      'Under a maintenance contract, system-down incidents receive a four-hour response within business hours, with 24/7 dispatch for critical infrastructure. Lower-severity issues are addressed on the next working day. Exact windows are written into each contract.',
  },
  {
    category: 'Support',
    order: 3,
    question: 'What warranty applies to your work?',
    answer:
      'Hardware carries its manufacturer warranty, which we administer. Installation workmanship is warranted for twelve months from acceptance, and custom software is warranted against defects in delivered functionality for ninety days.',
  },
];

const CAREERS = [
  {
    slug: 'senior-full-stack-engineer',
    title: 'Senior Full-Stack Engineer',
    department: 'Software Engineering',
    type: EmploymentType.FULL_TIME,
    location: 'Metro Manila',
    isRemote: true,
    salaryRange: 'Competitive, based on experience',
    description: `<p>You will lead delivery of custom enterprise systems — ERP, hospital information systems, warehouse management — from architecture through to production support. This is hands-on engineering with direct client contact, not a ticket queue.</p>`,
    responsibilities: [
      'Design and build production systems with Next.js, TypeScript and PostgreSQL',
      'Own the data model and migration strategy for assigned projects',
      'Review code and mentor mid-level engineers',
      'Participate in client requirement sessions and technical walkthroughs',
      'Support production systems during the post-launch stabilisation period',
    ],
    requirements: [
      'Five or more years building production web applications',
      'Strong TypeScript, React and Node.js experience',
      'Practical relational database design and query optimisation skills',
      'Experience taking a system from requirements through to live operation',
      'Clear written and spoken communication with non-technical stakeholders',
    ],
    benefits: [
      'HMO from day one, extended to a dependent after regularisation',
      'Hybrid working for engineering roles',
      'Certification sponsorship and paid study time',
      'Annual review against a documented salary band',
    ],
  },
  {
    slug: 'network-infrastructure-engineer',
    title: 'Network Infrastructure Engineer',
    department: 'Infrastructure',
    type: EmploymentType.FULL_TIME,
    location: 'Metro Manila (with nationwide deployment travel)',
    isRemote: false,
    salaryRange: 'Competitive, plus field allowances',
    description: `<p>You will design and commission structured cabling, fiber backbones, enterprise wireless and firewall deployments for hospitals, campuses, warehouses and government offices.</p>`,
    responsibilities: [
      'Conduct site surveys and produce cabling and wireless designs',
      'Supervise installation teams and certify completed cable runs',
      'Configure switches, routers, firewalls and wireless controllers',
      'Produce as-built documentation, topology diagrams and patching schedules',
      'Respond to escalated faults on maintenance contracts',
    ],
    requirements: [
      'Three or more years in enterprise network installation and configuration',
      'CCNA or equivalent certification, or demonstrable equivalent experience',
      'Hands-on fiber splicing and cable certification testing experience',
      'Willingness to travel for site deployments',
      'Valid driving licence',
    ],
    benefits: [
      'HMO from day one',
      'Field and transport allowances for site deployments',
      'Manufacturer training and certification sponsorship',
      'Company-provided tools and test equipment',
    ],
  },
  {
    slug: 'cctv-security-technician',
    title: 'CCTV & Security Systems Technician',
    department: 'Security Systems',
    type: EmploymentType.FULL_TIME,
    location: 'Metro Manila (with regional deployments)',
    isRemote: false,
    salaryRange: 'Competitive, plus field allowances',
    description: `<p>You will install, commission and maintain IP surveillance, biometric access control and attendance systems across client sites.</p>`,
    responsibilities: [
      'Install and terminate camera, reader and control cabling to standard',
      'Configure NVRs, cameras and access control panels',
      'Commission systems and verify footage quality against the design',
      'Deliver operator handover training on site',
      'Carry out preventive maintenance visits under service contracts',
    ],
    requirements: [
      'Two or more years installing IP CCTV and access control systems',
      'Comfortable working at height with appropriate safety training',
      'Basic networking knowledge including IP addressing and VLANs',
      'Technical or vocational qualification in electronics or a related field',
    ],
    benefits: [
      'HMO from day one',
      'Field and transport allowances',
      'Manufacturer product training',
      'Clear progression path to senior technician and supervisor roles',
    ],
  },
  {
    slug: 'project-manager-technology',
    title: 'Technology Project Manager',
    department: 'Delivery',
    type: EmploymentType.FULL_TIME,
    location: 'Metro Manila',
    isRemote: true,
    salaryRange: 'Competitive, based on experience',
    description: `<p>You will run concurrent delivery across software and infrastructure projects, holding schedules, budgets and client communication together from kickoff to handover.</p>`,
    responsibilities: [
      'Own project schedules, budgets and resource allocation',
      'Run client status reporting and manage scope changes formally',
      'Coordinate engineering, field and procurement teams',
      'Track risks and dependencies, escalating early',
      'Drive acceptance testing and formal handover',
    ],
    requirements: [
      'Four or more years managing technology delivery projects',
      'Experience with both software and physical infrastructure projects',
      'Confident managing client expectations and difficult conversations',
      'PMP, PRINCE2 or equivalent certification is an advantage',
    ],
    benefits: [
      'HMO from day one, extended to a dependent after regularisation',
      'Hybrid working arrangement',
      'Certification sponsorship',
      'Performance bonus tied to delivery outcomes',
    ],
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function seedAdminUser() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@j2securetech.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME ?? 'System Administrator';

  const hashed = await bcrypt.hash(password, 12);

  // Update the profile but never silently reset an existing password.
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role: UserRole.ADMIN, isActive: true },
    create: { email, name, password: hashed, role: UserRole.ADMIN, isActive: true },
  });

  return { user, password, email };
}

async function main() {
  console.log('Seeding J2 SecureTech database…');

  const { user, email, password } = await seedAdminUser();
  console.log(`  ✓ administrator: ${email}`);

  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: { ...service, isActive: true },
    });
  }
  console.log(`  ✓ ${SERVICES.length} services`);

  for (const industry of INDUSTRIES) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: industry,
      create: { ...industry, isActive: true },
    });
  }
  console.log(`  ✓ ${INDUSTRIES.length} industries`);

  for (const project of PROJECTS) {
    await prisma.portfolio.upsert({
      where: { slug: project.slug },
      update: project,
      create: { ...project, isActive: true },
    });
  }
  console.log(`  ✓ ${PROJECTS.length} portfolio projects`);

  for (const post of POSTS) {
    const data = {
      ...post,
      authorId: user.id,
      authorName: 'J2 SecureTech Engineering',
      isPublished: true,
      metaDesc: post.excerpt.slice(0, 300),
    };

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: data,
      create: data,
    });
  }
  console.log(`  ✓ ${POSTS.length} blog articles`);

  // Testimonials and FAQs have no natural unique key, so replace them wholesale.
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: TESTIMONIALS.map((item) => ({ ...item, isActive: true })) });
  console.log(`  ✓ ${TESTIMONIALS.length} testimonials`);

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({ data: FAQS.map((item) => ({ ...item, isActive: true })) });
  console.log(`  ✓ ${FAQS.length} FAQs`);

  for (const career of CAREERS) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: career,
      create: { ...career, isActive: true },
    });
  }
  console.log(`  ✓ ${CAREERS.length} career listings`);

  console.log('\nSeed complete.');
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`\n  Sign in at /admin/login with ${email} / ${password}`);
    console.log('  Change this password immediately after first sign-in.\n');
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
