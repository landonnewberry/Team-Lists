import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addItem, removeItem } from '../actions/items';
import io from 'socket.io-client';
import { registerBindings } from '../utils';
import { initialize, addDocument } from '../actions/documents';
import { SOCKET_URL } from '../constants';


class DocumentComponent extends Component {

    constructor(props) {
        super(props);
        this.socket = io.connect(SOCKET_URL);;
        const { 
            addItemLocal, 
            removeItemLocal, 
            initializeLocal,
            toggleAvailable
        } = this.props;
        const bindings = {
            'RECEIVE_ITEM': (value, documentId, id) => addItemLocal(value, documentId, id),
            'REMOVE_ITEM': (documentId, id) => removeItemLocal(documentId, id),
            'INITIALIZE': (documents) => initializeLocal(documents),
        }
        registerBindings(this.socket)(bindings);
        // on window close
        this.unload = (e) => toggleAvailable(this.socket)(this.props.document.id);
    }

    componentDidMount() {
        const { document, toggleAvailable } = this.props;
        if (document !== null) {
            toggleAvailable(this.socket)(document.id);
            window.addEventListener("beforeunload", this.unload);
        }
    }

    componentWillUnmount() {
        const { document, toggleAvailable } = this.props;
        if (document !== null) {
            toggleAvailable(this.socket)(document.id);
            window.removeEventListener("beforeunload", this.unload);
        }
        this.socket.close();
    }
    

    render() {
        const { document, removeItem, addItem } = this.props;

        if ((document === null || !document.available) && !document.shared) {
            return <Redirect to="/" />;
        }

        let input;
        const id = document.id;
        const socket = this.socket;
        return (
            <div>
                <h1>{ document.title }</h1>
                <ul>
                    { document.items.map(item =>
                        <div key={ item.id }>
                            <li>
                                { item.value }
                                &nbsp;&nbsp;
                                <button onClick={ () => removeItem(socket)(id, item.id) }>X</button>
                            </li>
                        </div>
                    ) }
                </ul>
                <input type="text" ref={ node => input = node } />
                <button 
                    onClick={ () => {
                        addItem(socket)(input.value, id);
                        input.value = '';
                    } }>
                    Add Item
                </button>
                <br/><br/>
                <Link to="/"><button>Back</button></Link>
            </div>
        );
    }
}


export const Document = connect(
    (state, ownProps) => {
        const id = ownProps.match.params.id;
        return {
            document: id in state.documents.byId ? state.documents.byId[id] : null,
            addItem: (socket) => (value, documentId) => socket.emit('ADD_ITEM', { value, documentId }),
            removeItem: (socket) => (documentId, id) => socket.emit('REMOVE_ITEM', { documentId, id }),
            toggleAvailable: (socket) => (documentId) => socket.emit('TOGGLE_AVAILABLE', { documentId })
        };
    },
    dispatch => ({
        addItemLocal: (value, documentId, id) => dispatch(addItem(value, documentId, id)),
        removeItemLocal: (documentId, id) => dispatch(removeItem(documentId, id)),
        initializeLocal: (documents) => dispatch(initialize(documents)),
        addDocumentLocal: (title, items, shared, available, id) => dispatch(addDocument(title, items, shared, available, id))
    })
)(DocumentComponent);