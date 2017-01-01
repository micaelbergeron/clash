/*
 * action types
 */

export const CHANGE_ACTOR_PROP = 'CHANGE_ACTOR_PROP';
export const ADD_ACTOR = 'ADD_ACTOR';
export const REMOVE_ACTOR = 'REMOVE_ACTOR';
export const SELECT_ACTOR = 'SELECT_ACTOR';

export function changeActorProp(actor, prop, mod) {
    actor = actor.id || actor
    return {
        type: CHANGE_ACTOR_PROP,
        actor,
        prop,
        mod
    }
}

export function addActor(actor) {
    return {
        type: ADD_ACTOR,
	actor
    }
}

export function removeActor(actor) {
    var actor = actor.id || actor 
    return {
        type: REMOVE_ACTOR,
        actor
    }
}

/*
 * A selector can either be
 *   motion: 'next', 'prev', +1, -1
 *   relative: 'first', 'last', <index>
 *   id: <actor id>
 */
export function selectActor(selector) {
    var parsed = false;
    var type, arg;
    if (!parsed && selector.hasOwnProperty('motion')) {
        parsed = true;
        type = 'motion';
        switch(selector.motion) {
          case 'next':
            arg = 1;
            break;
          case 'prev':
          case 'previous':
            arg = -1;
            break;
          default:
            args = Number(selector.motion);
        }
    }

    if (!parsed && selector.hasOwnProperty('id')) {
        parsed = true;
        type = 'id';
        arg = selector.id;        
    }

    if (!parsed && selector.hasOwnProperty('relative')) {
        parsed = true;
        type = 'relative';
        switch(selector.relative) {
        case 'first':
        case 'head':
            arg = 0;
            break;
        case 'last':
        case 'tail':
            arg = -1;
            break;
        default:
            arg = Number(selector.relative);
        }
    }

    if (!parsed) throw "Invalid selector, valid keys are 'motion', 'relative' or 'id'.";
    
    return {
        type: SELECT_ACTOR,
        motion: {type, arg}
    }
}
