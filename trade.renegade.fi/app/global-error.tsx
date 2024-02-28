'use client'

import { env } from "@/env.mjs"
import { useEffect, useState } from "react"
import "@/styles/fonts.css"

const RELAYER_HOSTNAME = env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost" ? "http://localhost:3000" : `https://${env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME}:3000`
export default function GlobalError({ }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [connected, setConnected] = useState(false);
    const handlePing = async () => {
        const res = await fetch(`${RELAYER_HOSTNAME}/v0/ping`);
        if (res.ok) {
            setConnected(true);
        } else {
            setConnected(false);
        }
    };

    useEffect(() => {
        handlePing();
    }, []);

    const message = connected ? "Refresh the page to try again" : "Thanks for being patient while we fix this.";

    return (
        <html>
            <body style={{
                position: 'absolute', // Use absolute positioning
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0, // Remove default margin
                padding: 0, // Remove default padding
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Favorit',
                backgroundColor: '#010101',
                color: '#fff',
            }}>
                <div>
                    <h1>Uh oh</h1>
                    <p>Something went wrong.</p>
                    <p>
                        Relayer at {RELAYER_HOSTNAME} is <span style={{ color: connected ? '#4DBE95' : '#D84F68' }}>
                            {connected ? "connected" : "disconnected"}
                        </span>
                    </p>
                    <p>{message}</p>
                </div>
            </body>
        </html>
    );
}
