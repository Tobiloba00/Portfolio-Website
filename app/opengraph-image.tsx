import { ImageResponse } from 'next/og';

export const alt = 'Tobiloba Olujimi — AI Systems Builder & Startup Founder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#080808',
                    color: '#F0F0F0',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontSize: 96,
                        fontWeight: 700,
                        letterSpacing: -2,
                    }}
                >
                    TOBILOBA
                    <span style={{ color: '#F5A623' }}>.</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 32,
                        color: '#F5A623',
                        letterSpacing: 6,
                        marginTop: 28,
                        textTransform: 'uppercase',
                    }}
                >
                    AI Systems Builder &amp; Startup Founder
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 20,
                        color: '#777',
                        marginTop: 18,
                        textTransform: 'uppercase',
                        letterSpacing: 4,
                    }}
                >
                    AI Automation for Growing Businesses &amp; Startups
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
