"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const DEFAULT_SETTINGS = {
    enableDynamicAnchors: true,
    optimizeAllCanvases: false,
    enableVisualFeedback: true
};
class CanvasConnectPlugin extends obsidian_1.Plugin {
    constructor() {
        super(...arguments);
        this.animationFrame = null;
        this.lastNodePositions = {};
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[Canvas Connect] Plugin loaded");
            yield this.loadSettings();
            this.addSettingTab(new CanvasConnectSettingTab(this.app, this));
            this.addCommand({
                id: 'optimize-canvas-connections',
                name: 'Optimize Canvas connections',
                callback: () => {
                    new obsidian_1.Notice("Optimizing Canvas connections");
                    this.optimizeAllConnections(this.settings.optimizeAllCanvases, true);
                }
            });
            this.startMonitoringCanvas();
        });
    }
    onunload() {
        if (this.animationFrame !== null)
            cancelAnimationFrame(this.animationFrame);
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    startMonitoringCanvas() {
        const monitor = () => {
            if (!this.settings.enableDynamicAnchors) {
                this.animationFrame = requestAnimationFrame(monitor);
                return;
            }
            const leaf = this.app.workspace.getMostRecentLeaf();
            if (!leaf || leaf.view.getViewType() !== "canvas") {
                this.animationFrame = requestAnimationFrame(monitor);
                return;
            }
            const canvas = leaf.view.canvas;
            if (!canvas || !canvas.data || !canvas.data.nodes) {
                this.animationFrame = requestAnimationFrame(monitor);
                return;
            }
            let changed = false;
            for (const node of canvas.data.nodes) {
                const last = this.lastNodePositions[node.id];
                if (!last || last.x !== node.x || last.y !== node.y) {
                    changed = true;
                    break;
                }
            }
            if (changed) {
                this.optimizeAllConnections(false, false);
                this.lastNodePositions = Object.fromEntries(canvas.data.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
            }
            this.animationFrame = requestAnimationFrame(monitor);
        };
        this.animationFrame = requestAnimationFrame(monitor);
    }
    optimizeAllConnections(all, showNotice = true) {
        const recentLeaf = this.app.workspace.getMostRecentLeaf();
        const leaves = all
            ? this.app.workspace.getLeavesOfType("canvas")
            : (recentLeaf && recentLeaf.view.getViewType() === "canvas")
                ? [recentLeaf]
                : [];
        if (leaves.length === 0) {
            if (showNotice) {
                new obsidian_1.Notice("No open Canvas views found");
            }
            return;
        }
        for (const leaf of leaves) {
            const canvas = leaf.view.canvas;
            if (!canvas || !canvas.data || typeof canvas.setData !== 'function') {
                console.warn("[Canvas Connect] Missing canvas data or setData method");
                continue;
            }
            const newData = structuredClone(canvas.data);
            const nodeMap = new Map(newData.nodes.map((n) => [n.id, n]));
            for (const edge of newData.edges) {
                const fromNode = nodeMap.get(edge.fromNode);
                const toNode = nodeMap.get(edge.toNode);
                if (!fromNode || !toNode)
                    continue;
                const fromCenterX = fromNode.x + fromNode.width / 2;
                const fromCenterY = fromNode.y + fromNode.height / 2;
                const toCenterX = toNode.x + toNode.width / 2;
                const toCenterY = toNode.y + toNode.height / 2;
                const deltaX = toCenterX - fromCenterX;
                const deltaY = toCenterY - fromCenterY;
                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);
                const oldFrom = edge.fromSide;
                const oldTo = edge.toSide;
                if (absX > absY * 1.5) {
                    edge.fromSide = deltaX > 0 ? "right" : "left";
                    edge.toSide = deltaX > 0 ? "left" : "right";
                }
                else if (absY > absX * 1.5) {
                    edge.fromSide = deltaY > 0 ? "bottom" : "top";
                    edge.toSide = deltaY > 0 ? "top" : "bottom";
                }
                else {
                    edge.fromSide = deltaX > 0 ? "right" : "left";
                    edge.toSide = deltaY > 0 ? "top" : "bottom";
                }
                if (this.settings.enableVisualFeedback && (oldFrom !== edge.fromSide || oldTo !== edge.toSide)) {
                    edge.color = '#ff9900';
                    setTimeout(() => {
                        edge.color = undefined;
                        canvas.setData(newData);
                        if (canvas.requestFrame) {
                            canvas.requestFrame();
                        }
                    }, 800);
                }
            }
            canvas.setData(newData);
            if (canvas.requestFrame) {
                canvas.requestFrame();
            }
            if (canvas.requestSave) {
                canvas.requestSave();
            }
        }
        if (showNotice) {
            new obsidian_1.Notice(`Optimized connections on ${leaves.length} Canvas${leaves.length !== 1 ? 'es' : ''}`);
        }
    }
}
exports.default = CanvasConnectPlugin;
class CanvasConnectSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian_1.Setting(containerEl)
            .setName('Enable dynamic anchors')
            .setDesc('Automatically adjust connection anchors as nodes are moved')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.enableDynamicAnchors)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.enableDynamicAnchors = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Optimize all open canvases')
            .setDesc('Run the optimization on every open canvas tab instead of just the active one')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.optimizeAllCanvases)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.optimizeAllCanvases = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Enable visual feedback')
            .setDesc('Highlight updated connections with a glow effect')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.enableVisualFeedback)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.enableVisualFeedback = value;
            yield this.plugin.saveSettings();
        })));
        containerEl.createEl('p', {
            text: 'You can also manually optimize all connections using the "Optimize Canvas connections" command.'
        });
    }
}

/* nosourcemap */