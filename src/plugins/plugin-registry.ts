import type { FieldPlugin } from '../types/plugin.js';

// ─────────────────────────────────────────────
// Plugin Registry — Singleton
// ─────────────────────────────────────────────

class PluginRegistry {
    private plugins = new Map<string, FieldPlugin>();

    /**
     * Register a custom field type.
     * @param plugin - The plugin definition including type identifier and component
     */
    register(plugin: FieldPlugin): void {
        if (this.plugins.has(plugin.type)) {
            console.warn(`[react-dynform] Plugin type "${plugin.type}" is already registered. Overwriting.`);
        }
        this.plugins.set(plugin.type, plugin);
    }

    /**
     * Retrieve a registered plugin by field type.
     */
    get(type: string): FieldPlugin | undefined {
        return this.plugins.get(type);
    }

    /**
     * Check if a given type has a registered plugin.
     */
    has(type: string): boolean {
        return this.plugins.has(type);
    }

    /**
     * Unregister a plugin (useful in tests).
     */
    unregister(type: string): void {
        this.plugins.delete(type);
    }

    /**
     * List all registered plugin type identifiers.
     */
    list(): string[] {
        return Array.from(this.plugins.keys());
    }
}

// Singleton instance
const registry = new PluginRegistry();

/**
 * Register a custom field type plugin.
 *
 * @example
 * registerField({
 *   type: 'date-picker',
 *   component: MyDatePicker,
 *   validate: (value) => value ? null : 'Date is required',
 * });
 */
export function registerField(plugin: FieldPlugin): void {
    registry.register(plugin);
}

/**
 * Get the global plugin registry (internal use).
 */
export function getPluginRegistry(): PluginRegistry {
    return registry;
}
