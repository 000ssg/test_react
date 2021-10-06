import React from 'react';
import { useTable, useSortBy } from 'react-table'
import miniIcon from './1.png';
import editIcon from './edit.png';
import deleteIcon from './delete.png';
import './App.css';
import initialData from "./data.json"

const appTitle = "Nord Software"
// https://regex101.com/r/QXAhGV/1
const phoneCheck = new RegExp(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/m);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initialData, // table data
      add: { name: "", email: "", phone: "" }, // new entry data
      addErrors: {}, // new entry errors
      modify: {},
      modifyErrors: {}, // editing entry errors
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  /**
   * Participant entry validation
   * @param {*} obj 
   * @returns 
   */
  validateInput(obj) {
    const errors = {}

    // simulate empty if none
    if (!obj) obj = {}

    // check 
    if (!obj.name) { errors.name = "Cannot be empty" }
    if (!obj.email) { errors.email = "Cannot be empty" }
    else if (obj.email.indexOf("@") < 1) { errors.email = "Invalid e-mail address" }
    if (obj.phone) {
      if (!phoneCheck.test(obj.phone)) {
        errors.phone = "Invalid phone number"
      }
    }

    return errors;
  }

  /**
   * data persistence (TODO)
   */
  saveData() {
    console.debug("Data updated, ready to save")
  }

  /**
   * Add new participant if valid entry and clean add fields
   * @param {*} event 
   */
  handleAdd(event) {
    const errors = this.validateInput(this.state.add)
    const hasError = errors.name || errors.email || errors.phone;
    if (!hasError) {
      this.setState({
        data: this.state.data.concat({
          id: "" + this.state.data
            .map(item => parseInt("" + item.id))
            .reduce((acc, val) => val > acc ? val : acc, 0) + 1,
          ...this.state.add
        }),
        add: { name: "", email: "", phone: "" },
        addErrors: {},
      })
      this.saveData()
    } else {
      this.setState({
        addErrors: hasError ? errors : {}
      })
    }
  }

  /**
   * inline editing row selection: NO WARNING IF UNSAVED PREVIOUS ENTRY!!!
   * @param {*} event 
   */
  handleSelect(event) {
    const itemId = event.target.value
    const item = this.state.data.find(item => item.id === itemId)
    if (item) {
      this.setState({
        modify: { ...item },
        modifyErrors: {},
      })
    }
  }

  /**
   * Modify value for new (add) or modified entry's single attribute.
   * Expects target name in form: "<entry>:<field>" where entry is "add" or"modify".
   * @param {*} event 
   */
  handleChange(event) {
    const [entryName, fieldName] = event.target.name.split(":");

    if (entryName && fieldName) {
      this.setState({ [entryName]: { ...this.state[entryName], [fieldName]: event.target.value } })
    }
  }

  /**
   * Save changes for modified entry, if valid.
   * @param {*} event 
   */
  handleSave(event) {
    const item = this.state.data.find(item => item.id === this.state.modify.id);
    const errors = this.validateInput(this.state.modify)
    const hasError = errors.name || errors.email || errors.phone;

    if (!hasError) {
      Object.assign(item, this.state.modify);

      this.setState({
        data: this.state.data.slice(),
        modify: {},
        modifyErrors: {},
      })
      this.saveData()
    } else {
      this.setState({
        modifyErrors: errors
      })
    }
  }

  /**
   * Cancel entry modification
   * @param {*} event 
   */
  handleCancel(event) {
    this.setState({
      modify: {},
      modifyErrors: {},
    })
  }

  /**
   * Delete entry: entry id is in target.value.
   * @param {*} event 
   */
  handleDelete(event) {
    this.setState({
      data: this.state.data.filter(a => a.id !== event.target.value),
      modify: {},
      modifyErrors: {},
    })
    this.saveData()
  }

  render() {
    const {
      data,
      add,
      addErrors,
      modify,
      modifyErrors
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={miniIcon} className="App-logo" alt="logo" /><div className="App-title">{appTitle}</div>
        </header>
        <div className="App-body">
          <Table
            data={data}
            add={add}
            addErrors={addErrors}
            modify={modify}
            modifyErrors={modifyErrors}
            api={{
              add: this.handleAdd,
              select: this.handleSelect,
              delete: this.handleDelete,
              change: this.handleChange,
              save: this.handleSave,
              cancel: this.handleCancel,
            }}
          />
        </div>
      </div>
    );
  }
}

function Table(props) {
  console.debug("Table.render");

  const {
    data, // table data
    add, // new entry data
    addErrors, // new entry errors
    modify, // editing entry data
    modifyErrors, // editing entry errors
    api // data manipulation methods (handlers)
  } = props;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'E-Mail',
        accessor: 'email',
      },
      {
        Header: 'Phone number',
        accessor: 'phone',
      },
    ],
    []
  );

  const initialState = { hiddenColumns: ['id'] };

  const tableInstance = useTable({ columns, data, initialState, autoResetSortBy: false }, useSortBy);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    <div className="Participants">
      <div className="Item-title">List of participants</div>
      <div className="Entries">

        <table className="Table" {...getTableProps()}>
          <thead>
            <tr className="TrA">
              <DrawEditCell name="add:name" title="Full name"
                value={add.name} handler={api.change} error={addErrors.name}
                tdStyle="TdAA" inputStyle="AddInput"
              />
              <DrawEditCell name="add:email" title="E-mail address"
                value={add.email} handler={api.change} error={addErrors.email}
                tdStyle="TdAA" inputStyle="AddInput"
              />
              <DrawEditCell name="add:phone" title="Phone number"
                value={add.phone} handler={api.change} error={addErrors.phone}
                tdStyle="TdAA" inputStyle="AddInput"
              />
              <td className="TdAA" valign="middle">
                <div className="ActionCell">
                  <input type="button" className="AddButton" value="Add new" onClick={api.add}></input>
                </div>
              </td>
            </tr>
            {// Loop over the header rows
              headerGroups.map(headerGroup => (
                // Apply the header row props
                <tr className="TrH" {...headerGroup.getHeaderGroupProps()}>
                  {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props
                      <th className="Th" {...column.getHeaderProps(column.getSortByToggleProps())}><div className="ThCell">
                        {// Render the header
                          column.render('Header')}
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                        </span>
                      </div>
                      </th>
                    ))}
                  <th className="Th" >&nbsp;</th>
                </tr>
              ))}
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
              rows.map(row => {
                // Prepare the row for display
                prepareRow(row)
                return (modify && modify.id === row.values.id
                  ? <DrawInlineEditRow row={row} api={api} modify={modify} modifyErrors={modifyErrors} />
                  : <DrawDataRow row={row} api={api} />
                )
              })}
          </tbody>
        </table>        </div>
    </div>
  );
}

function DrawDataRow(props) {
  const {
    row,
    api
  } = props;

  return (
    // Apply the row props
    <tr className="TrD" {...row.getRowProps()}>
      {// Loop over the rows cells
        row.cells.map(cell => {
          // Apply the cell props
          return (
            <td className="TdD" {...cell.getCellProps()}><div className="DataCell">
              {// Render the cell contents
                cell.render('Cell')}</div>
            </td>
          )
        })}
      <td className="TdA">
        <div className="EditActionCell">
          <button className="EditButton" onClick={api.select} value={row.values.id}>
            <img src={editIcon} className="ActionIcon" alt="edit" />
          </button>
          <button className="DeleteButton" onClick={api.delete} value={row.values.id}>
            <img src={deleteIcon} className="ActionIcon" alt="delete" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function DrawInlineEditRow(props) {
  const {
    row,
    api,
    modify,
    modifyErrors
  } = props;

  return (
    <tr className="TrE" {...row.getRowProps()}>
      <DrawEditCell name="modify:name" title="Full name"
        value={modify.name} handler={api.change} error={modifyErrors.name}
        tdStyle="TdE" inputStyle="EditInput"
      />
      <DrawEditCell name="modify:email" title="E-mail address"
        value={modify.email} handler={api.change} error={modifyErrors.email}
        tdStyle="TdE" inputStyle="EditInput"
      />
      <DrawEditCell name="modify:phone" title="Phone number"
        value={modify.phone} handler={api.change} error={modifyErrors.phone}
        tdStyle="TdE" inputStyle="EditInput"
      />
      <td className="TdA" valign="middle">
        <div className="ActionCell">
          <input type="button" className="ECancelButton" value="Cancel" onClick={api.cancel}></input>
          <input type="button" className="ESaveButton" value="Save" onClick={api.save}></input>
        </div>
      </td>
    </tr>
  )
}


/**
 * name, title, value, handler, error, tdStyle, inputStyle
 * @param {*} props 
 * @returns 
 */
function DrawEditCell(props) {
  const {
    tdStyle,
    inputStyle,
    name,
    title,
    value,
    handler,
    error
  } = props;
  return (
    <td className={tdStyle}>
      <input className={inputStyle} name={name} size="12" placeholder={title} value={value} onChange={handler}></input>
      {error ? <span style={{ color: "red" }}><br />{error}</span> : ""}
    </td>
  )
}

export default App;
