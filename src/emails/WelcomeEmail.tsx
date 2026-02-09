import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Img,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    username: string;
}

export const WelcomeEmail = ({
    username,
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Vibe Stranding, {username}!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logo}>🦀 Vibe Stranding</Text>
                </Section>
                <Heading style={h1}>The Aura is Strong, {username}.</Heading>
                <Text style={text}>
                    Welcome to the network. You've just taken your first step into the future of AI-assisted development. We're excited to have you in the collective.
                </Text>

                <Section style={statsSection}>
                    <Text style={statsTitle}>YOUR JOURNEY BEGINS NOW</Text>
                    <Hr style={hr} />
                    <Text style={text}>
                        You are starting as a <strong>🌱 Sprout</strong>. Complete challenges, earn XP, and climb the ranks of "Vibe Stranding" to master the new era of coding.
                    </Text>
                </Section>

                <Section style={btnContainer}>
                    <Link
                        style={button}
                        href="https://vibe-stranding.vercel.app/dashboard"
                    >
                        Enter the Dashboard
                    </Link>
                </Section>

                <Text style={text}>
                    If you have any questions or just want to share your vibes, join our community of creators.
                </Text>

                <Hr style={hr} />

                <Text style={footer}>
                    Vibe Stranding • AI-Powered Learning Platform
                    <br />
                    Keep coding, keep vibing.
                </Text>
                <Text style={spamNotice}>
                    We hate spam too. We only send relevant network updates.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

const main = {
    backgroundColor: '#0f0f0f',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '580px',
};

const logo = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#c4a75d', // Chiral Gold
    textAlign: 'center' as const,
    marginBottom: '20px',
};

const header = {
    padding: '20px 0',
};

const h1 = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#d1d1d1',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'left' as const,
};

const statsSection = {
    backgroundColor: '#1a1a1a',
    padding: '24px',
    borderRadius: '12px',
    margin: '30px 0',
};

const statsTitle = {
    color: '#888',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    margin: '0 0 10px 0',
};

const btnContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#c4a75d',
    borderRadius: '8px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 30px',
};

const hr = {
    borderColor: '#333',
    margin: '20px 0',
};

const footer = {
    color: '#666',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '40px',
};

const spamNotice = {
    color: '#555',
    fontSize: '11px',
    textAlign: 'center' as const,
    marginTop: '10px',
    fontStyle: 'italic',
};
