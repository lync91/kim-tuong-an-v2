import React from "react";
import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useFlexLayout,
  useRowSelect,
  useResizeColumns,
  usePagination,
  useSortBy,
} from "react-table";
// A great library for fuzzy filtering/sorting items
// import matchSorter from 'match-sorter'
import { Input, DatePicker } from "antd";
import Button from "antd-button-color";
import {
  VerticalLeftOutlined,
  VerticalRightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { round } from "mathjs";
import { ipcRenderer, remote } from "electron";
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const Styles = styled.div`
  padding: 1rem;
  ${
    "" /* These styles are suggested for the table fill all available space in its containing element */
  }
  display: block;
  ${
    "" /* These styles are required for a horizontaly scrollable table overflow */
  }
  overflow: auto;

  .table {
    border-spacing: 0;
    border: 1px solid #bfbfbf;
    font-size: 14px;
    .thead {
      ${
        "" /* These styles are required for a scrollable body to align with the header properly */
      }
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      ${"" /* These styles are required for a scrollable table body */}
      overflow-y: scroll;
      overflow-x: hidden;
      height: 860px;
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      border-bottom: 1px solid #bfbfbf;
    }
    .thp {
      height: 56px;
    }

    .filter-box {
      margin-top: 5px;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.3rem;
      border-right: 1px solid #bfbfbf;

      ${
        "" /* In this example we use an absolutely position resizer,
     so this is required. */
      }
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        ${"" /* prevents from scrolling while dragging on touch devices */}
        touch-action :none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex",
    },
  },
];

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Tìm kiếm chung:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} kết quả...`}
        style={{
          fontSize: "1rem",
          border: "0",
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, width },
}) {
  const count = preFilteredRows.length;
  return (
    <Input
      allowClear
      size="small"
      // style={{ width: width - 4 }}
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Tìm ${count} phiếu...`}
    />
  );
}

// function trongLuongMethod(filter, row) {
//   // if (filter.value === "all") {
//   //   return true;
//   // }
//   // if (filter.value === "true") {
//   //   return row[filter.id] >= 21;
//   // }
//   // return row[filter.id] < 21;
//   console.log('OK');
// }

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      className="selectFilter"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Tất cả</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Input
        size="small"
        value={filterValue[0] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? parseInt(val) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        style={{
          marginRight: "0.5rem",
        }}
      />
    </div>
  );
}

// function fuzzyTextFilterFn(rows, id, filterValue) {
//   return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
// }

// Let the table remove the filter if the string is empty
// fuzzyTextFilterFn.autoRemove = val => !val

// Our table component

function dateCell({ value }) {
  return value ? moment(value).format("DD/MM/YYYY") : "";
}
function dateHourCell({ value }) {
  return value ? moment(value).format("DD/MM/YYYY HH:mm") : "";
}
function tienCell({ value }) {
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
}
function roundCell({ value }) {
  return value ? round(value, 3) : "";
}

const labelRender = ({ value, row }) => {
  const c = row.values;
  let text = "";
  let color = "";
  // var start = moment(c.ngaycam).format('X');
  var end = moment(c.ngayhethan).format("X");
  var now = moment().format("X");
  const han = (end - now) / (60 * 60 * 24);
  if (c.ngaychuoc <= 0) {
    text = "Chưa chuộc";
    color = "#ffc7b2";
  }
  if (c.ngaychuoc > 0) {
    text = "Đã chuộc";
    color = "#a7d7ff";
  }
  if (c.dahuy > 0) {
    text = "Đã hủy";
    color = "#ffd0d0";
  }
  return <div style={{ background: color, paddingLeft: 4 }}>{text}</div>;
};

function Table({ columns, data, onRowClicked }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    setAllFilters,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    footerGroups,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 30 },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useFlexLayout,
    useSortBy,
    usePagination,
    useRowSelect,
    useResizeColumns
  );

  const checkData = () => {

  }

  const fixKhoiLuong = () => {
    const dt = data.filter(
      (e) =>
        round(Number(e.trongluongthuc | 0), 2) +
          round(Number(e.trongluonghot | 0), 2) !==
        round(Number(e.tongtrongluong | 0), 2)
    );
    console.log(dt);
    dt.map((e) =>
      console.log(e.trongluongthuc + e.trongluonghot, e.tongtrongluong)
    );
  };

  const backupData = () => {
    ipcRenderer.invoke("backupData", data).then((res) => {
      console.log('OK');
    })
  }

  const exportExcel = () => {
    var dialog = remote.dialog;

    var browserWindow = remote.getCurrentWindow();
    var options = {
      title: "Xuất dữ liệu.",
      defaultPath: "/path/to/data.xlsx",
      filters: [
        {
          name: "Excel 2007 trở lên",
          extensions: ["xlsx"],
        },
      ],
    };

    let saveDialog = dialog.showSaveDialog(browserWindow, options);
    saveDialog.then(function (saveTo) {
      console.log(saveTo.filePath);
      //>> /path/to/new_file.jsx
      ipcRenderer.invoke("excelExport", saveTo.filePath, data).then((result) => {
        console.log(result);
      });
    });

    
  };
  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(10)
  return (
    <div style={{ padding: 0 }}>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className="tr thp"
            >
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render("Header")}
                  <span
                    className="sortButton"
                    {...column.getSortByToggleProps()}
                  >
                    {` `}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <SortDescendingOutlined />
                      ) : (
                        <SortAscendingOutlined />
                      )
                    ) : (
                      <MinusCircleOutlined />
                    )}
                  </span>
                  <div className="filter-box">
                    {column.canFilter ? column.render("Filter") : null}
                  </div>
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {/* {column.canResize && (
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                )} */}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tbody">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div>
          {footerGroups.map((group) => (
            <div {...group.getFooterGroupProps()} className="tr tft">
              {group.headers.map((column) => (
                <div {...column.getFooterProps()} className="th">
                  {column.render("Footer")}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        <Button
          size="small"
          type="primary"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <DoubleLeftOutlined />
        </Button>{" "}
        <Button
          size="small"
          type="primary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <VerticalRightOutlined />
        </Button>{" "}
        <Button
          size="small"
          type="primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <VerticalLeftOutlined />
        </Button>{" "}
        <Button
          size="small"
          type="primary"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <DoubleRightOutlined />
        </Button>{" "}
        <span>
          Trang{" "}
          <strong>
            {pageIndex + 1} của {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Đi đến trang:{" "}
          <Input
            size="small"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          hidden
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Hiện {pageSize}
            </option>
          ))}
        </select>
        <Button type="info" size="small" onClick={() => setAllFilters([])}>
          Xóa lọc
        </Button>
        <Button
          style={{ marginLeft: 5 }}
          type="warning"
          size="small"
          onClick={checkData}
        >
          Kiểm tra
        </Button>
        <Button
          style={{ marginLeft: 5 }}
          type="warning"
          size="small"
          onClick={fixKhoiLuong}
        >
          Fix khối lượng
        </Button>
        <Button
          style={{ marginLeft: 5 }}
          type="warning"
          size="small"
          onClick={backupData}
        >
          Sao lưu
        </Button>
        <Button
          style={{ marginLeft: 5 }}
          type="success"
          size="small"
          onClick={exportExcel}
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

function trangThaiFilter(props) {
  const {
    column: { filterValue = "all", setFilter },
  } = props;
  return (
    <select
      className="selectFilter"
      value={filterValue}
      onChange={(e) => setFilter(e.target.value || undefined)}
    >
      <option key="all">Tất cả</option>
      <option key="chuachuoc">Chưa chuộc</option>
      <option key="dachuoc">Đã chuộc</option>
    </select>
  );
}

// function filterTrangThai(rows, id, filterValue) {
//   if (filterValue === 'Tất cả') return rows;
//   if (filterValue === 'Đã chuộc') {
//     return rows.filter(row => {
//       console.log(row.values['ngaychuoc']);
//       return row.values['ngaychuoc'] > 0
//     })
//   } else if (filterValue === 'Còn hạn') {
//     return rows.filter(row => {
//       var end = moment(row.values['ngayhethan']).format('X');
//       var now = moment().format('X');
//       return (now < end && row.values.ngaychuoc <= 0)
//     })
//   } else if (filterValue === 'Quá hạn') {
//     return rows.filter(row => {
//       var end = moment(row.values['ngayhethan']).format('X');
//       var now = moment().format('X');
//       return (end <= now && row.values['ngaychuoc'] <= 0)
//     })
//   }
//   else {
//     return []
//   }
// }

function filterTrangThai(rows, id, filterValue) {
  if (filterValue === "Tất cả") return rows;
  if (filterValue === "Đã chuộc") {
    return rows.filter((row) => {
      return row.values["ngaychuoc"] > 0;
    });
  } else if (filterValue === "Chưa chuộc") {
    return rows.filter((row) => {
      return row.values["ngaychuoc"] <= 0;
    });
  } else {
    return [];
  }
}

function dateRangFilter(props) {
  const {
    column: { filterValue = [], setFilter },
  } = props;
  return (
    <RangePicker
      size="small"
      className="dateFilter"
      onChange={(e) => setFilter(e)}
      format={dateFormat}
    />
  );
}

function filterDateRange(rows, id, filterValue) {
  if (filterValue === null) return rows;
  try {
    const start = filterValue[0].startOf("Day").format("x");
    const end = filterValue[1].endOf("Day").format("x");
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue >= start && rowValue <= end;
    });
  } catch (error) {
    return [];
  }
}

function trongLuonFilter(props) {
  const {
    column: { filterValue = [], preFilteredRows, setFilter, id },
  } = props;
  // attach the onChange method from props's object to element
  const count = preFilteredRows.length;
  return (
    <Input
      allowClear
      size="small"
      // style={{ width: width - 4 }}
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Tìm ${count} phiếu...`}
    />
  );
}

function filterTrongLuong(rows, id, filterValue) {
  const mtxt = /\<[\d]{1,99}([.]\d{1,99})?/g.test(filterValue);
  if (mtxt) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0];
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue < num;
    });
  } else if (/\<=[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0];
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue <= num;
    });
  } else if (/\>[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0];
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue > num;
    });
  } else if (/\>=[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0];
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue >= num;
    });
  } else if (
    /[\d]{1,99}([.]\d{1,99})?\-[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)
  ) {
    const num1 = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0];
    const num2 = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[1];
    return rows.filter((row) => {
      const rowValue = row.values[id];
      if (rowValue >= num1 && rowValue <= num2) {
        return row;
      }
    });
  } else {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue === Number(filterValue);
    });
  }
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

function BangThongKe(props) {
  const { data, onSelectRow } = props;

  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
        width: 5,
      },
      {
        Header: "Số phiếu",
        accessor: "sophieu",
        Footer: (info) => info.rows.length,
        Cell: ({ value, row }) => {
          return <a onClick={() => onSelectRow(row.values)}>{value}</a>;
        },
        width: 80,
      },
      {
        Header: "Tên khách",
        accessor: "tenkhach",
      },
      {
        Header: "Món hàng",
        accessor: "monhang",
        width: 150,
      },
      {
        Header: "Loại vàng",
        accessor: "loaivang",
        Filter: SelectColumnFilter,
        filter: "includes",
        width: 75,
      },
      {
        Header: "Tổng",
        accessor: "tongtrongluong",
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.tongtrongluong
                    ? parseFloat(row.values.tongtrongluong) + sum
                    : sum,
                0
              ),
            [info.rows]
          );

          return <>{`${Math.round(total * 100) / 100}`}</>;
        },
        width: 80,
      },
      {
        Header: "Hột",
        accessor: "trongluonghot",
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.trongluonghot
                    ? parseFloat(row.values.trongluonghot) + sum
                    : sum,
                0
              ),
            [info.rows]
          );
          return <>{`${Math.round(total * 100) / 100}`}</>;
        },
        width: 80,
      },
      {
        Header: "Thực",
        accessor: "trongluongthuc",
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.trongluongthuc
                    ? parseFloat(row.values.trongluongthuc) + sum
                    : sum,
                0
              ),
            [info.rows]
          );

          return <>{`${Math.round(total * 100) / 100}`}</>;
        },
        Cell: roundCell,
        width: 80,
      },
      {
        Header: "Ngày cầm",
        accessor: "ngaycam",
        Cell: dateHourCell,
        Filter: dateRangFilter,
        filter: filterDateRange,
        width: 120,
      },
      {
        Header: "Ngày tính lãi",
        accessor: "ngaytinhlai",
        Filter: dateRangFilter,
        filter: filterDateRange,
        Cell: dateHourCell,
        width: 100,
      },
      {
        Header: "Ngày hết hạn",
        accessor: "ngayhethan",
        Cell: dateCell,
        width: 90,
      },
      {
        Header: "Tiền cầm",
        accessor: "tiencam",
        Cell: tienCell,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.tiencam
                    ? Number(row.values.tiencam | 0) + sum
                    : sum,
                0
              ),
            [info.rows]
          );

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</>;
        },
        filter: "equals",
        width: 100,
      },
      {
        Header: "Lãi suất",
        accessor: "laisuat",
        width: 60,
      },
      {
        Header: "Tiền lãi",
        accessor: "tienlai",
        Cell: tienCell,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.tienlai
                    ? Number(row.values.tienlai | 0) + sum
                    : sum,
                0
              ),
            [info.rows]
          );

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</>;
        },
        width: 100,
      },
      {
        Header: "Tiền chuộc",
        accessor: "tienchuoc",
        Cell: tienCell,
        width: 100,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) =>
                  row.values.tienchuoc
                    ? Number(row.values.tienchuoc | 0) + sum
                    : sum,
                0
              ),
            [info.rows]
          );

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</>;
        },
      },
      {
        Header: "Ngày chuộc",
        accessor: "ngaychuoc",
        Cell: dateHourCell,
        Filter: dateRangFilter,
        filter: filterDateRange,
        width: 150,
      },
      {
        Header: "Tủ đồ",
        accessor: "tudo",
        width: 60,
      },
      {
        Header: "Trạng thái",
        accessor: "trangthai",
        Cell: labelRender,
        Filter: trangThaiFilter,
        filter: filterTrangThai,
        width: 100,
      },
    ],
    []
  );

  return (
    <Styles>
      <Table
        className="camdoTable"
        onRowClicked={(row) => onSelectRow(row)}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value
        }
        columns={columns}
        data={data}
      />
    </Styles>
  );
}

export default BangThongKe;
