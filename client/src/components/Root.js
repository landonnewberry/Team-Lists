import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { initialize, toggleAvailable, addDocument } from '../actions/documents';
import { registerBindings } from '../utils';
import io from 'socket.io-client';
import { SOCKET_URL } from '../constants';


class RootComponent extends Component {
    
    componentDidMount() {
        const { initializeLocal, toggleAvailableLocal, addDocumentLocal } = this.props;
        this.socket = io.connect(SOCKET_URL);
        const bindings = {
            'INITIALIZE': (documents) => initializeLocal(documents),
            'TOGGLE_AVAILABLE': (documentId) => toggleAvailableLocal(documentId),
            'RECEIVE_DOCUMENT': (title, items, shared, available, id) => addDocumentLocal(title, items, shared, available, id)
        };
        registerBindings(this.socket)(bindings);
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        const { documents, addDocument } = this.props;
        let input, shared = false;
        return (
            <div>
                <ul>
                    { documents.allIds.map(id => {
                        let doc = documents.byId[id];
                        return <li
                                style={{
                                    color: doc.shared ? 'purple' : doc.available ? 'green' : 'red',
                                }}
                                key={ id }>
                                { doc.shared ? "Collaborative" : doc.available ? "Available" : "In Use" } - &nbsp;
                                <Link style={{ color: 'black' }} to={ "/list/" + id }>{ doc.title }</Link>
                            </li>;
                    }) }
                </ul>
                <input type="text" ref={ node => input = node } />
                <input type="checkbox" onChange={ (e) => shared = e.target } /> Collaborative
                <button 
                    onClick={ () => { 
                        if (shared.checked !== undefined) {
                            addDocument(this.socket)(input.value, shared.checked); 
                            shared.checked = false;
                        } else {
                            addDocument(this.socket)(input.value, shared);
                        }
                        input.value = '';
                    } }>
                    Add List
                </button>
            </div>
        );
    }
}


export const Root = connect(
    state => ({
        documents: state.documents,
        addDocument: (socket) => (title, shared) => socket.emit('ADD_DOCUMENT', { title, shared })
    }),
    dispatch => ({
        initializeLocal: (documents) => dispatch(initialize(documents)),
        toggleAvailableLocal: (documentId) => dispatch(toggleAvailable(documentId)),
        addDocumentLocal: (title, items, shared, available, id) => dispatch(addDocument(title, items, shared, available, id))
    })
)(RootComponent);