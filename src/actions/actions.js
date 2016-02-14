/*
 * action types
 */

export const CHANGE_ACTOR_PROP = 'CHANGE_ACTOR_PROP'
export function changeActorProp(index, prop, mod) {
    return {
        type: CHANGE_ACTOR_PROP,
        index,
        prop,
        mod
    }
}

export const ADD_ACTOR = 'ADD_ACTOR'
export function addActor(actor) {
    return {
        type: ADD_ACTOR,
        actor
    }
}
    
export const SELECT_ACTOR = 'SELECT_ACTOR'
export function selectActor(actor_or_id) {
    return {
        type: SELECT_ACTOR,
        actor: actor_or_id
    }
}
