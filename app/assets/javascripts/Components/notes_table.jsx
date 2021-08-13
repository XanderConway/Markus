import React from 'react';
import {render} from 'react-dom';

import ReactTable from 'react-table';

class NotesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      columns: {},
      loading: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    $.get({
      url: Routes.notes_path({format : 'json'})
    }).then(res => {
      this.setState({
        notes: res,
        loading: false,
      });
    });
  };

  renderButtons(editable, id) {
    if(editable) {
      return(
        <div>
          <div>
            <a href={Routes.edit_note_path(id)} className="inline-button button">
              {I18n.t('edit')}
            </a>
          </div>

          <div>
            <a href={Routes.note_path(id) + id} className="inline-button button" data-method="delete" data-confirm={I18n.t('notes.delete.link_confirm')}>
              {I18n.t('delete')}
            </a>
          </div>
        </div>
      );
    } else {
      return('');
    }
  }

  note_author(index) {
    return (
      <React.Fragment>
        <div>
          {I18n.t('notes.note_on_html',
            {user_name: this.state.notes[index]['user_name'],
              display_for: this.state.notes[index]['display_for']})}
        </div>

        <div>
          {this.state.notes[index]['date']}
        </div>
      </React.Fragment>
    )
  }


  data() {
    return this.state.notes.map((note, i) => {
      let row = {
        'name': this.note_author(i),
        'message': note['message'],
        'action': this.renderButtons(note['modifiable'], note['id'])
      }

      return row;
    })
  }

  columns =  [

  //   column_header = {
  //     messages: Note.human_attribute_name(:notes_message),
  // human_name:  Note.model_name.human.pluralize,
  // actions: t(:actions)
}
    {
      Header: I18n.t('activerecord.models.group.one')
,
      accessor: 'name',
      width: 400,
      style: { 'whiteSpace': 'unset' }
    },
    {
      Header: 'Messages',
      accessor: 'message',
      style: { 'whiteSpace': 'unset' }

    },
    {
      Header: 'Actions',
      accessor: 'action',
      width: 200,
      mid_width: 100
    }
  ];

  render() {
    return (
      <ReactTable
        data={this.data()}
        columns={this.columns}
        sortable={false}
        loading={this.state.loading}
      />
    );
  }
}

export function makeNotesTable(elem, props) {
  render(<NotesTable {...props} />, elem);
}
