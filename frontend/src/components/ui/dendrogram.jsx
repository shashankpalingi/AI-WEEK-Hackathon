import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork } from 'lucide-react';
import './Dendrogram.css';

// ─── Layout helpers ───

function buildTree(files) {
    if (!files || files.length === 0) return null;

    const clusters = {};
    files.forEach((f) => {
        const label = f.cluster_label || `Cluster ${f.cluster_id}`;
        if (!clusters[label]) clusters[label] = [];
        const name = f.file ? f.file.split('/').pop() : 'Unknown';
        clusters[label].push(name);
    });

    return {
        name: 'Knowledge Base',
        children: Object.entries(clusters).map(([label, fileNames]) => ({
            name: label,
            children: fileNames.map((n) => ({ name: n })),
        })),
    };
}

// Simple top-down tree layout
function layoutTree(node, depth = 0, index = 0, siblingCount = 1) {
    const result = { ...node, depth, x: 0, y: depth * 100, children: [] };

    if (node.children && node.children.length > 0) {
        result.children = node.children.map((child, i) =>
            layoutTree(child, depth + 1, i, node.children.length)
        );
    }
    return result;
}

// Assign x positions using a post-order traversal
let leafIndex = 0;
function assignX(node, spacing) {
    if (!node.children || node.children.length === 0) {
        node.x = leafIndex * spacing;
        leafIndex++;
        return;
    }

    node.children.forEach((child) => assignX(child, spacing));

    // Parent is centered above children
    const first = node.children[0].x;
    const last = node.children[node.children.length - 1].x;
    node.x = (first + last) / 2;
}

// Collect all nodes and links
function flatten(node) {
    const nodes = [node];
    const links = [];

    if (node.children) {
        node.children.forEach((child) => {
            links.push({ source: node, target: child });
            const { nodes: cn, links: cl } = flatten(child);
            nodes.push(...cn);
            links.push(...cl);
        });
    }
    return { nodes, links };
}

const DendrogramChart = React.memo(({ files }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect;
            setDimensions({ width, height: 0 }); // height computed from tree
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const { nodes, links, svgWidth, svgHeight } = useMemo(() => {
        const tree = buildTree(files);
        if (!tree) return { nodes: [], links: [], svgWidth: 0, svgHeight: 0 };

        const laid = layoutTree(tree);
        const leafSpacing = Math.max(120, Math.min(160, dimensions.width / 6));
        leafIndex = 0;
        assignX(laid, leafSpacing);

        const { nodes: n, links: l } = flatten(laid);

        // Calculate bounds
        const maxX = Math.max(...n.map((nd) => nd.x));
        const maxY = Math.max(...n.map((nd) => nd.y));

        return {
            nodes: n,
            links: l,
            svgWidth: maxX + 120,
            svgHeight: maxY + 80,
        };
    }, [files, dimensions.width]);

    if (!files || files.length === 0) {
        return (
            <div className="dendrogram-card">
                <div className="dendrogram-header">
                    <GitFork size={16} />
                    <span>Cluster Visualization</span>
                </div>
                <div className="dendrogram-empty">
                    <GitFork size={28} className="empty-icon" />
                    <p>No files to visualize</p>
                    <span>Upload files to see the cluster dendrogram</span>
                </div>
            </div>
        );
    }

    const padX = 60;
    const padY = 40;
    const viewBox = `${-padX} ${-padY} ${svgWidth + padX * 2} ${svgHeight + padY * 2}`;

    return (
        <div className="dendrogram-card">
            <div className="dendrogram-header">
                <GitFork size={16} />
                <span>Cluster Visualization</span>
                <span className="dendro-badge">{files.length} files</span>
            </div>

            <div className="dendrogram-container" ref={containerRef}>
                <svg
                    viewBox={viewBox}
                    width={svgWidth + padX * 2}
                    height={svgHeight + padY * 2}
                    className="dendrogram-svg"
                    style={{ maxWidth: '100%' }}
                >
                    {/* Links */}
                    {links.map((link, i) => {
                        const midY = (link.source.y + link.target.y) / 2;
                        const path = `M ${link.source.x} ${link.source.y}
                                      C ${link.source.x} ${midY},
                                        ${link.target.x} ${midY},
                                        ${link.target.x} ${link.target.y}`;
                        return (
                            <motion.path
                                key={i}
                                d={path}
                                fill="none"
                                className="dendro-link"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.04 }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node, i) => {
                        const isRoot = node.depth === 0;
                        const isLeaf = !node.children || node.children.length === 0;
                        const displayName = node.name.length > 18 ? node.name.slice(0, 16) + '…' : node.name;
                        const textWidth = displayName.length * 6;
                        const rectW = Math.max(50, textWidth + 14);
                        const rectH = 28;

                        return (
                            <motion.g
                                key={`${node.name}-${i}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 + i * 0.05, type: 'spring', bounce: 0.3 }}
                            >
                                {isLeaf ? (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={8}
                                        className="dendro-node-leaf"
                                    />
                                ) : (
                                    <rect
                                        x={node.x - rectW / 2}
                                        y={node.y - rectH / 2}
                                        width={rectW}
                                        height={rectH}
                                        rx={rectH / 2}
                                        className={isRoot ? 'dendro-node-root' : 'dendro-node-branch'}
                                    />
                                )}

                                <text
                                    x={node.x}
                                    y={isLeaf ? node.y + 24 : node.y + 1}
                                    textAnchor="middle"
                                    dominantBaseline={isLeaf ? "auto" : "middle"}
                                    className={`dendro-label ${isRoot ? 'root-label' : isLeaf ? 'leaf-label' : 'branch-label'}`}
                                >
                                    {displayName}
                                </text>
                            </motion.g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
});

export default DendrogramChart;
