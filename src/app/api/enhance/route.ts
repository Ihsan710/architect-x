import { NextResponse } from 'next/server';
import { ArchitectureOutput, EnhancementResponse } from '@/types';

// Helper to inject a node into a Mermaid Monolith diagram string
function injectMonolithNode(diagram: string, nodeId: string, nodeName: string, connectionPath: string = "api -.->"): string {
    // Find the end of the Application subgraph
    const insertPoint = diagram.indexOf('  end\n');
    if (insertPoint !== -1) {
        return diagram.slice(0, insertPoint) + `    ${connectionPath} ${nodeId}["${nodeName}"]\n` + diagram.slice(insertPoint);
    }
    return diagram;
}

// Helper to inject a node into a Mermaid Microservices diagram string
function injectMicroserviceNode(diagram: string, nodeId: string, nodeName: string, connectionPath: string = "gw -->"): string {
    const insertPoint = diagram.indexOf('  end\n');
    if (insertPoint !== -1) {
        return diagram.slice(0, insertPoint) + `    ${connectionPath} ${nodeId}["${nodeName}"]\n` + diagram.slice(insertPoint);
    }
    return diagram;
}

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const data: ArchitectureOutput = JSON.parse(bodyText);

        if (!data.architectureStyle || !data.services) {
            return NextResponse.json({ error: 'Missing architecture data' }, { status: 400 });
        }

        let changes_made: string[] = [];
        let reasoning: string[] = [];
        let updated_services = [...data.services];
        let updated_infrastructure = [data.database, data.cache];
        let updated_scaling_strategy = data.scalingStrategy;
        let updated_mermaid_diagram = data.mermaidDiagram;

        const isMicroservices = data.architectureStyle === 'Microservices';
        const hasRealtime = updated_services.some(s => s.toLowerCase().includes('realtime') || s.toLowerCase().includes('websocket'));
        const hasAlerts = updated_services.some(s => s.toLowerCase().includes('alert'));

        // 1. Security Improvements (Missing WAF/Rate Limiting)
        if (!updated_services.some(s => s.includes('WAF'))) {
            const nodeName = "WAF & Rate Limiter (Cloudflare)";
            updated_services.push(nodeName);
            changes_made.push("Added Web Application Firewall (WAF) & Rate Limiting");
            reasoning.push("Current architecture exposes the load balancer directly. A WAF prevents DDoS and scraping.");

            // Re-route the client to hit the WAF first
            updated_mermaid_diagram = updated_mermaid_diagram.replace(
                `top["Client App"] --> lb["Load Balancer"]`,
                `top["Client App"] --> waf["WAF & Rate Limiter"]\n  waf --> lb["Load Balancer"]`
            );
        }

        // 2. Caching Improvement (Upgrading basic cache)
        if (data.cache === 'None' || data.cache === 'Redis (Cache)') {
            const newCache = isMicroservices ? 'Redis Cluster (Distributed)' : 'Redis (Cache + Session Store)';
            updated_infrastructure[1] = newCache;
            changes_made.push(`Upgraded Cache to ${newCache}`);
            reasoning.push("Standard memory caching was insufficient or missing. A dedicated Redis tier accelerates read-heavy routes.");

            // Replace cache strings in visual diagram
            if (data.cache !== 'None') {
                updated_mermaid_diagram = updated_mermaid_diagram.replace(new RegExp(data.cache.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCache);
            } else {
                updated_mermaid_diagram += `\n  api --> cache{"${newCache}"}\n`;
            }
        }

        // 3. Failure Handling (Multi-AZ Deployment)
        if (!updated_scaling_strategy.includes('Multi-AZ')) {
            updated_scaling_strategy = updated_scaling_strategy.replace('.', ' across Multi-AZ zones for high availability.');
            changes_made.push("Enabled Multi-AZ Deployment in Scaling Strategy");
            reasoning.push("Current topology lacked redundancy. Spreading instances across availability zones ensures fault tolerance.");
        }

        // 4. Read Replica Necessity
        if (updated_infrastructure[0] === 'PostgreSQL (Relational)' && !updated_infrastructure[0].includes('Replica')) {
            updated_infrastructure[0] = 'PostgreSQL (Primary) + Read Replica';
            changes_made.push("Attached Read Replica to Primary Database");
            reasoning.push("A single database instance creates a heavy I/O bottleneck. Separating read queries improves throughput.");
            updated_mermaid_diagram = updated_mermaid_diagram.replace('PostgreSQL (Relational)', 'PostgreSQL + Read Replica');
        }

        const output: EnhancementResponse = {
            changes_made,
            reasoning,
            updated_services,
            updated_scaling_strategy,
            updated_infrastructure,
            updated_mermaid_diagram
        };

        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return NextResponse.json(output);

    } catch (error) {
        console.error('Enhancer API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
