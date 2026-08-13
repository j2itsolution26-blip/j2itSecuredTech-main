/**
 * Shared catalogue data.
 *
 * Extracted from the seed so one-off maintenance scripts can upsert services
 * without running the full seed, which replaces testimonials and FAQs wholesale.
 *
 * `SERVICES` is the canonical catalogue: nine groups matching the company
 * service list. `RETIRED_SLUGS` covers services that were published earlier and
 * must be deactivated rather than deleted, so their records, audit history and
 * any inbound links survive.
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

/**
 * Previously published services now folded into the nine groups. Website
 * development became a line item under Software & System Development; cloud,
 * consultancy and maintenance retainers left the published catalogue.
 */
export const RETIRED_SLUGS = [
  'website-development',
  'cloud-solutions',
  'it-consultancy',
  'technical-support',
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const SERVICES = [
  {
    slug: 'software-development',
    title: 'Software & System Development',
    category: ServiceCategory.SOFTWARE,
    icon: 'Code2',
    order: 1,
    isFeatured: true,
    image: IMAGES.software,
    summary:
      'Websites, custom applications, database systems and business or school management platforms built around how your organisation actually operates.',
    description: `<p>Off-the-shelf software forces your processes to match its assumptions. We build systems the other way round — starting from your workflows, approval chains and reporting obligations, then designing the data model that supports them.</p>
<h2>How we work</h2>
<p>Development runs in two-week increments against a documented backlog. You get access to a staging environment from the first sprint, so feedback happens while changes are still cheap. Every release ships with migration scripts, rollback steps and updated user documentation.</p>
<h2>Built to be maintained</h2>
<p>Systems are delivered with source code, database schema documentation, an administrator guide and staff training. Role-based access control, audit trails and automated backups are standard rather than optional extras.</p>`,
    features: [
      'Website Development',
      'Custom System and Application Development',
      'Database and Information Management Systems',
      'Business and School Management Systems',
      'System Integration and Automation',
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
    slug: 'iot-automation-solutions',
    title: 'IoT, Automation & Emerging Technologies',
    category: ServiceCategory.IOT,
    icon: 'Radio',
    order: 2,
    isFeatured: true,
    image: IMAGES.network,
    summary:
      'IoT platforms, smart monitoring, microcontroller projects and robotics — carried past the prototype stage into systems your team can rely on daily.',
    description: `<p>Most "smart" projects stall between a working prototype and a system someone can actually rely on. We take IoT builds through that gap — from microcontroller firmware through to the dashboard a manager checks every morning.</p>
<h2>From prototype to production</h2>
<p>Sensor networks built on Arduino, ESP32 and industrial-grade controllers are engineered for the environment they will actually run in — power interruptions, patchy connectivity and years of unattended operation — not just a bench test.</p>
<h2>Automation that reports back</h2>
<p>Monitoring and control systems feed a central platform with alerting, historical trends and role-based access, so automation is visible and auditable rather than a black box.</p>`,
    features: [
      'IoT System Development and Innovation',
      'Smart Monitoring and Automation Systems',
      'Arduino, ESP32, and Microcontroller-Based Projects',
      'Robotics and Embedded Systems',
      'Customized Technology Solutions for specific organizational needs',
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
    slug: 'network-infrastructure',
    title: 'IT Infrastructure & Network Solutions',
    category: ServiceCategory.NETWORK,
    icon: 'Network',
    order: 3,
    isFeatured: true,
    image: IMAGES.network,
    summary:
      'Infrastructure design, network installation, server administration and firewall configuration — certified, documented and optimised for the load it carries.',
    description: `<p>Most network faults trace back to physical layer shortcuts taken during installation. We certify every run, label both ends, and hand over a patching schedule that still makes sense three years later.</p>
<h2>Design and certification</h2>
<p>Cabling is installed to TIA/EIA standards and certified with calibrated test equipment. You receive the test results, not just an assurance that it works.</p>
<h2>Wireless that holds up</h2>
<p>Wi-Fi is designed from a predictive survey and validated on site after installation, so coverage holds under real user density rather than on paper.</p>`,
    features: [
      'IT Infrastructure Design and Implementation',
      'Computer Network Design and Installation',
      'System Configuration and Network Setup',
      'Server Configuration and Administration',
      'Router, Switch, Firewall, and Wireless Network Configuration',
      'Network Troubleshooting and Optimization',
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
    slug: 'cybersecurity-solutions',
    title: 'Cybersecurity Solutions',
    category: ServiceCategory.CYBERSECURITY,
    icon: 'ShieldAlert',
    order: 4,
    isFeatured: true,
    image: IMAGES.cctv,
    summary:
      'Detection, monitoring, vulnerability assessment and hardening that reduce your actual attack surface, not just your compliance paperwork.',
    description: `<p>Cybersecurity work that only produces a report changes nothing. Every engagement ends with hardened systems and a written record of what was fixed, not just what was found.</p>
<h2>Assessment before action</h2>
<p>We assess network exposure, endpoint configuration and access controls before recommending anything, so remediation targets the risks that actually apply to your environment rather than a generic checklist.</p>
<h2>Monitoring that catches the quiet incidents</h2>
<p>Most breaches are noticed weeks after they start. Continuous monitoring and endpoint protection are configured to surface anomalies while they are still small enough to contain without a public incident.</p>`,
    features: [
      'Cybersecurity Detection and Prevention',
      'Network and System Security',
      'Security Monitoring',
      'Vulnerability Assessment',
      'Endpoint and Access Security',
      'Cybersecurity Awareness and Training',
      'Security Hardening and Preventive Measures',
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
    title: 'CCTV & Security Systems',
    category: ServiceCategory.SECURITY,
    icon: 'Cctv',
    order: 5,
    isFeatured: true,
    image: IMAGES.cctv,
    summary:
      'IP camera and network CCTV systems surveyed, installed, monitored and maintained — with security system integration across your other infrastructure.',
    description: `<p>Camera coverage is a design problem before it is a purchasing decision. We survey the site, map sightlines against lighting conditions, then specify sensors and lenses that produce usable footage at the distances that matter.</p>
<h2>Recording and retention</h2>
<p>Storage is sized to your actual retention requirement — typically thirty to ninety days — accounting for frame rate, resolution and motion patterns. Recorders are placed in secured, ventilated locations with UPS protection.</p>
<h2>Integrated, not isolated</h2>
<p>Surveillance ties into access control, alarms and attendance where required, so one incident review draws on every relevant system rather than three disconnected ones.</p>`,
    features: [
      'CCTV Installation and Configuration',
      'IP Camera and Network CCTV Systems',
      'CCTV Monitoring and Management',
      'Security System Integration',
      'Troubleshooting and Maintenance',
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
    slug: 'telephone-communication-systems',
    title: 'Telephone & Communication Systems',
    category: ServiceCategory.TELEPHONY,
    icon: 'Phone',
    order: 6,
    isFeatured: false,
    image: IMAGES.consulting,
    summary:
      'Telephone systems, IP telephony and intercom installed, configured and integrated with the rest of your network infrastructure.',
    description: `<p>Phone systems fail quietly for months before anyone escalates — a queue that never rings through, an extension nobody can reach. We install and configure voice systems the same way we treat data infrastructure: documented, tested and monitored.</p>
<h2>Built on the network, not beside it</h2>
<p>IP telephony shares infrastructure with your data network, so call quality depends on the same QoS configuration, VLAN segmentation and cabling discipline as everything else we install.</p>
<h2>Systems that scale with the organisation</h2>
<p>Extensions, call routing and intercom zones are configured to match your organisational chart today, with headroom documented for the next expansion rather than a rebuild.</p>`,
    features: [
      'Telephone System Installation and Configuration',
      'IP Telephony / VoIP Solutions',
      'Intercom and Communication Systems',
      'Network and Communication Infrastructure',
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
    title: 'Electronics & Board-Level Solutions',
    category: ServiceCategory.ELECTRONICS,
    icon: 'CircuitBoard',
    order: 7,
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
      'Electronics Troubleshooting and Repair',
      'Board-Level Diagnostics and Repair',
      'Component-Level Troubleshooting',
      'Electronic Circuit Testing',
      'Power Supply and Control Board Repair',
      'Preventive and Corrective Maintenance',
    ],
    deliverables: [
      'Written diagnostic report before repair authorisation',
      'Repaired unit with functional test results',
      'Parts warranty on replaced components',
      'Maintenance schedule recommendation',
    ],
  },
  {
    slug: 'technology-training-seminars',
    title: 'Technology Training & Professional Development',
    category: ServiceCategory.TRAINING,
    icon: 'GraduationCap',
    order: 8,
    isFeatured: false,
    image: IMAGES.campus,
    summary:
      'Seminars, workshops and technical training in development, cybersecurity, administration, IoT, robotics, electronics and hardware troubleshooting.',
    description: `<p>Training is only useful if participants can apply it the next working day. Our seminars and workshops are built around hands-on exercises using the same tools and scenarios participants will actually encounter.</p>
<h2>Delivered for the audience, not a generic syllabus</h2>
<p>Content is scoped to the participants' starting level and the organisation's actual technology stack, whether that is a two-day network administration bootcamp or a semester-length partnership with a school's IT programme.</p>`,
    features: [
      'Software and Web Development',
      'Cybersecurity and Ethical Hacking',
      'System Administration',
      'Network Administration',
      'Internet of Things (IoT)',
      'Robotics',
      'Electronics',
      'Computer Hardware and Troubleshooting',
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
    title: 'TESDA Technical Training',
    category: ServiceCategory.TRAINING,
    icon: 'Award',
    order: 9,
    isFeatured: false,
    image: IMAGES.campus,
    summary:
      'Technical instruction and training in Computer Systems Servicing, Electronic Products Assembly and Servicing, and Java Programming.',
    description: `<p>We deliver technical instruction aligned to TESDA competency standards, taught by people who perform the work professionally rather than instructors teaching purely from a curriculum.</p>
<h2>Skills assessed against a national standard</h2>
<p>Each programme is structured around the official competency-based curriculum, preparing participants for national certification assessment rather than a certificate of attendance alone.</p>`,
    features: [
      'Computer Systems Servicing NC II (CSS NC II)',
      'Electronic Products Assembly and Servicing NC II (EPAS NC II)',
      'Java Programming NC III',
    ],
    deliverables: [
      'Competency-based training aligned to TESDA curriculum standards',
      'Hands-on practical assessment sessions',
      'Certification assessment preparation and guidance',
      'Training completion documentation',
    ],
  },
];
