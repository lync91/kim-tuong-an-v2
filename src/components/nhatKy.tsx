import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline, Badge, Tag } from "antd";

const tagColor: any = {
  'Cầm': "#87d068",
  'Đóng lãi': "#2db7f5",
  'Cầm thêm': "#108ee9",
  'Chuộc': "#f50"
}

function NhatKy(props: any) {
  const { data } = props;
  console.log(data);

  return (
    <Timeline>
      {data.map((e: any) => {
        return (
            <Timeline.Item color="green">
              <Tag color="magenta">{e.thoigian ? e.thoigian.format("DD/MM/YYYY HH:mm"): ""}</Tag>
              <Tag color={tagColor[e.hoatdong] ? tagColor[e.hoatdong] : ""}>{e.hoatdong}</Tag>
              {e.noidung}
            </Timeline.Item>
        );
      })}
    </Timeline>
  );
}

export default NhatKy;
