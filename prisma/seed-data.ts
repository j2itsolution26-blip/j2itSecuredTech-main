/**
 * Shared catalogue data.
 *
 * Extracted from the seed so one-off maintenance scripts can upsert services
 * without running the full seed, which replaces testimonials and FAQs wholesale.
 */
import { ServiceCategory } from '@prisma/client';

export const IMAGES = {
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

export const SERVICES = [
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
