import { ImageResponse } from 'next/og';
import { COMPANY_INFO } from '@/lib/constants';

export const alt = `${COMPANY_INFO.name} — ${COMPANY_INFO.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social share card, generated at the edge so it never falls out of
 * sync with the brand and needs no binary asset in the repository.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(0,87,255,0.35) 0%, transparent 55%), radial-gradient(circle at 85% 75%, rgba(0,194,255,0.28) 0%, transparent 50%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0057ff, #00c2ff)',
              color: '#ffffff',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            J2
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#f8fafc', fontSize: 34, fontWeight: 700 }}>{COMPANY_INFO.name}</div>
            <div style={{ color: '#22d3ee', fontSize: 20, letterSpacing: 4 }}>
              {COMPANY_INFO.tagline.toUpperCase()}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            color: '#f8fafc',
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Enterprise Technology Solutions for Modern Businesses
        </div>

        <div style={{ marginTop: 32, color: '#94a3b8', fontSize: 26, maxWidth: 880 }}>
          Software · IoT · Networks · Cybersecurity · CCTV · Electronics · Training
        </div>
      </div>
    ),
    size,
  );
}
