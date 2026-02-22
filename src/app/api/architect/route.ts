import { NextResponse } from 'next/server';
import { ArchitectureInput, ArchitectureOutput } from '@/types';

export const dynamic = 'force-dynamic';

function generateArchitectureFeatures(scale: ArchitectureInput['scale'], requiresRealtime: boolean, requiresHeavyData: boolean, requiresAlerts: boolean) {
    let style: ArchitectureOutput['architectureStyle'] = 'Modular Monolith';
    let services = ['Web Server (Next.js)', 'Core API Module'];
    let database = 'PostgreSQL (Relational)';
    let cache = 'None';
    let scalingStrategy = 'Vertical scaling of primary server. Basic load balancing.';
    let cost = 0;
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    let score = 85;

    // Base monitoring added to all architectures
    const monitoringServices = ['Metrics & Logs (Prometheus/Grafana)'];

    let costBreakdown = { compute: 0, database: 0, network: 0 };

    if (scale === 'small') {
        cost = requiresHeavyData ? 80 : 35; // Server + DB
        costBreakdown = {
            compute: 20,
            database: requiresHeavyData ? 50 : 10,
            network: 5
        };
        if (requiresRealtime) {
            services.push('WebSocket Gateway');
            cost += 20;
            costBreakdown.compute += 10;
            costBreakdown.network += 10;
        }
        if (requiresAlerts) {
            services.push('Basic Alert Cronjob');
        }
    } else if (scale === 'medium') {
        style = 'Modular Monolith';
        services.push('Background Worker');
        database = 'PostgreSQL (Primary) + Read Replica';
        cache = 'Redis (Cache)';
        scalingStrategy = 'Horizontal scaling behind Load Balancer. Asynchronous task queues.';
        cost = 150 + (requiresHeavyData ? 100 : 0);
        costBreakdown = {
            compute: 80,
            database: 50 + (requiresHeavyData ? 100 : 0),
            network: 20
        };

        if (requiresRealtime) {
            services.push('Realtime Gateway (SSE/WS)');
            cache = 'Redis (Cache + Pub/Sub)'; // Upgrade redis usage
            cost += 80;
            costBreakdown.compute += 30;
            costBreakdown.network += 50;
        }
        if (requiresAlerts) {
            services.push('Alert Engine (Rule Processor)');
            services.push('Notification Dispatcher');
        }

        risk = 'Medium';
        score = 90;
    } else {
        style = 'Microservices';
        services = [
            'API Gateway',
            'Auth Service',
            'User Service',
        ];
        costBreakdown = {
            compute: 300,
            database: 300,
            network: 200
        };
        cost = costBreakdown.compute + costBreakdown.database + costBreakdown.network; // Initial cost for microservices

        if (requiresHeavyData) {
            services.push('Data Pipeline (Kafka)');
            services.push('Analytics Engine');
            cost += 400;
            costBreakdown.compute += 100;
            costBreakdown.database += 300;
        }

        if (requiresRealtime) {
            services.push('Realtime Gateway (WS)');
            cache = 'Redis Cluster (Pub/Sub + Edge Caching)';
            cost += 200;
            costBreakdown.compute += 50;
            costBreakdown.network += 150;
        } else {
            cache = 'Redis Cluster';
        }

        if (requiresAlerts) {
            services.push('Alert Engine Microservice');
            services.push('Notification Dispatcher');
        }

        database = 'PostgreSQL (Cluster) + Document DB';
        scalingStrategy = 'Kubernetes auto-scaling. Domain-driven micro-databases with event sourcing architecture.';
        risk = 'High';
        score = 95;
    }

    return {
        style,
        services: [...services, ...monitoringServices],
        database,
        cache,
        scalingStrategy,
        monthlyCostEstimate: cost, // Keep the total cost for backward compatibility if needed
        costBreakdown,
        risk,
        score
    };
}

function generateMermaidDiagram(
    scale: ArchitectureInput['scale'],
    style: ArchitectureOutput['architectureStyle'],
    services: string[],
    database: string,
    cache: string,
    requiresRealtime: boolean
) {
    let mermaid = `graph TD\n`;
    mermaid += `  top["Client App"] --> lb["Load Balancer"]\n`;

    if (style === 'Modular Monolith') {
        mermaid += `  subgraph Application\n`;
        mermaid += `    lb --> api["Core API Module"]\n`;

        services.forEach((srv, i) => {
            if (srv !== 'Core API Module' && !srv.includes('Metrics') && srv !== 'WebSocket Gateway' && srv !== 'Realtime Gateway (SSE/WS)') {
                mermaid += `    api -.-> srv${i}["${srv}"]\n`;
            }
        });

        if (requiresRealtime) {
            mermaid += `    lb --> ws["Realtime Gateway"]\n`;
            mermaid += `    ws -.-> api\n`;
            if (cache !== 'None') {
                mermaid += `    ws -.-> cache{"${cache}"}\n`;
            }
        }

        mermaid += `  end\n`;
        mermaid += `  api --> db[(" ${database} ")]\n`;
        if (cache !== 'None') {
            mermaid += `  api --> cache{"${cache}"}\n`;
        }

    } else {
        mermaid += `  subgraph Container_Orchestrator\n`;
        mermaid += `    lb --> gw{"API Gateway"}\n`;
        if (requiresRealtime) {
            mermaid += `    lb --> rtgw{"Realtime Gateway"}\n`;
        }

        services.forEach((srv, i) => {
            if (srv !== 'API Gateway' && srv !== 'Realtime Gateway (WS)' && !srv.includes('Metrics')) {
                // Determine connection origins
                if (srv.includes('Notification') || srv.includes('Alert')) {
                    mermaid += `    gw --> srv${i}["${srv}"]\n`;
                } else {
                    mermaid += `    gw --> srv${i}["${srv}"]\n`;
                    mermaid += `    srv${i} --> db[(" ${database} ")]\n`;
                }
                if (cache !== 'None') {
                    if (srv.includes('Alert') || srv.includes('Notification')) {
                        mermaid += `    cache --> srv${i}\n`; // Pub sub consumer
                    } else {
                        mermaid += `    srv${i} --> cache{"${cache}"}\n`; // Pub sub publisher or standard cache
                    }
                }
            }
        });

        if (requiresRealtime && cache !== 'None') {
            mermaid += `    rtgw --> cache\n`; // Realtime connects to Pub/Sub
        }

        mermaid += `  end\n`;
    }

    // Add Observability Layer universally
    mermaid += `  subgraph Observability\n`;
    mermaid += `    obs["Metrics, Logs & Tracing"]\n`;
    mermaid += `  end\n`;
    mermaid += `  Application -.-> obs\n`;
    mermaid += `  Container_Orchestrator -.-> obs\n`;

    return mermaid;
}

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const data: ArchitectureInput = JSON.parse(bodyText);

        if (!data.projectName || !data.scale || !data.description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const descLower = data.description.toLowerCase();
        const requiresRealtime = descLower.includes('realtime') || descLower.includes('chat') || descLower.includes('live') || descLower.includes('socket');
        const requiresHeavyData = descLower.includes('analytics') || descLower.includes('ai') || descLower.includes('video') || descLower.includes('big data');
        const requiresAlerts = descLower.includes('alert') || descLower.includes('threshold') || descLower.includes('notification');

        const features = generateArchitectureFeatures(data.scale, requiresRealtime, requiresHeavyData, requiresAlerts);

        const mermaidDiagram = generateMermaidDiagram(
            data.scale,
            features.style,
            features.services,
            features.database,
            features.cache,
            requiresRealtime
        );

        const output: ArchitectureOutput = {
            projectName: data.projectName,
            architectureStyle: features.style,
            services: features.services,
            database: features.database,
            cache: features.cache,
            scalingStrategy: features.scalingStrategy,
            monthlyCostEstimate: features.monthlyCostEstimate,
            costBreakdown: features.costBreakdown,
            riskLevel: features.risk,
            architectureScore: features.score,
            mermaidDiagram,
        };

        await new Promise(resolve => setTimeout(resolve, 800));
        return NextResponse.json(output);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
