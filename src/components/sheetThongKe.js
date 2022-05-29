import React, { useState } from "react";
import DataGrid from "react-data-grid";
import moment from "moment";
// import { Toolbar, Data } from "react-data-grid-addons";
import { useWindowSize } from "../utils/hooks";

const NumberFormat = (props) => {
  const { value } = props;
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
};

function DateFormat({ value }) {
  return value ? moment(value).format("DD/MM/YYYY") : "";
}
function DateTimeFormat({ value }) {
  return value ? moment(value).format("DD/MM/YYYY HH:mm") : "";
}

const columns = [
  // {
  //   name: "id",
  //   key: "id",
  // },
  {
    name: "Số phiếu",
    key: "sophieu",
    width: 100,
  },
  {
    name: "Tên khách",
    key: "tenkhach",
    filterable: true,
    width: 96,
  },
  {
    name: "Món hàng",
    key: "monhang",
    width: 120,
  },
  {
    name: "Loại vàng",
    key: "loaivang",
    width: 80,
  },
  {
    name: "Tổng",
    key: "tongtrongluong",
    width: 80,
  },
  {
    name: "Hột",
    key: "trongluonghot",
    width: 80,
  },
  {
    name: "Thực",
    key: "trongluongthuc",
    width: 80,
  },
  {
    name: "Ngày cầm",
    key: "ngaycam",
    formatter: DateTimeFormat,
    width: 140,
  },
  {
    name: "Ngày tính lãi",
    key: "ngaytinhlai",
    formatter: DateFormat,
    width: 106,
  },
  {
    name: "Ngày hết hạn",
    key: "ngayhethan",
    formatter: DateFormat,
    width: 106,
  },
  {
    name: "Tiền cầm",
    key: "tiencam",
    formatter: NumberFormat,
    width: 100,
  },
  // {
  //   name: "Lãi suất",
  //   key: "laisuat",
  //   width: 60,
  // },
  {
    name: "Tiền lãi",
    key: "tienlai",
    formatter: NumberFormat,
  },
  {
    name: "Tiền chuộc",
    key: "tienchuoc",
    formatter: NumberFormat,
  },
  {
    name: "Ngày chuộc",
    key: "ngaychuoc",
    formatter: DateTimeFormat,
    width: 150,
  },
  {
    name: "Tủ đồ",
    key: "tudo",
    width: 60,
  },
  {
    name: "Trạng thái",
    key: "trangthai",
    width: 100,
  },
];
export default function SheetThongKe({ rows }) {
  const { height } = useWindowSize();
  const [filters, setFilters] = useState({});
  const handleFilterChange = filter => filters => {
    const newFilters = { ...filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    return newFilters;
  };
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      minHeight={height - 60}
      className="rdg-light test"
      rowGetter={(i) => rows[i]}
      rowsCount={rows.length}
      // toolbar={<Toolbar enableFilter={true} />}
      onAddFilter={filter => setFilters(handleFilterChange(filter))}
      onClearFilters={() => setFilters({})}
    />
  );
}
