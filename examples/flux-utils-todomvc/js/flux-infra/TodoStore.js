/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import Immutable from 'immutable';

import {ReduceStore} from 'flux/utils';
import Todo from './Todo';
import TodoDispatcher from './TodoDispatcher';

// Set up the store, If we didn't care about order we could just use MapStore

class TodoStore extends ReduceStore {
  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce (state, action) {
    switch (action.type) {
      case 'todo/complete':
        return state.setIn([action.id, 'complete'], true);

      case 'todo/create':
        return createTodo(state, action.text);

      case 'todo/destroy':
        return state.delete(action.id);

      case 'todo/destroy-completed':
        return state.filter(todo => !todo.complete);

      case 'todo/toggle-complete-all':
        const setCompleted = !this.areAllComplete();
        return state.map(todo => todo.set('complete', setCompleted));

      case 'todo/undo-complete':
        return state.setIn([action.id, 'complete'], false);

      case 'todo/update-text':
        return state.setIn([action.id, 'text'], action.text.trim());

      default:
        return state;
    }
  }

  areAllComplete() {
    return this.getState().every(todo => todo.complete);
  }
}

// Pure helper function to create a new Todo and add it to the state.
function createTodo(state, text) {
  if (!text) {
    return state;
  }
  var newTodo = new Todo(text);
  return state.set(newTodo.id, newTodo);
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
const instance = new TodoStore(TodoDispatcher);
export default instance;
