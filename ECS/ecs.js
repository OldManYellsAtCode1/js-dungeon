// Entity - just an ID that ties components together
class Entity {
    constructor(id) {
        this.id = id;
        this.components = {};
    }

    addComponent(component) {
        this.components[component.constructor.name] = component;
        return this; // for method chaining
    }

    getComponent(componentType) {
        return this.components[componentType.name];
    }

    hasComponent(componentType) {
        return !!this.components[componentType.name];
    }

    removeComponent(componentType) {
        delete this.components[componentType.name];
        return this;
    }
}

// The Entity Component System - manages entities and systems
class ECS {
    constructor() {
        this.entities = [];
        this.systems = [];
        this.nextEntityId = 1000;
    }

    createEntity() {
        const entity = new Entity(this.nextEntityId++);
        this.entities.push(entity);
        return entity;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(deltaTime) {
        this.systems.forEach(system => {
            system.update(this.entities, deltaTime);
        });
    }

    resetEntities() {
        this.entities = [];
    }
}