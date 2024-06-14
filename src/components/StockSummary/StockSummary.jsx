import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import { DateRangePicker, IconButton } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";

import "rsuite/dist/rsuite.css";

import TableSkeleton from "../../Skeleton/TableSkeleton";
import useHttpErrorHandler from "../../utils/userHttpErrorHandler";
import { dateToNumber } from "../../utils/dateToNumber";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // Add borders
  "& td, & th": {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
      ];
    },
    appearance: "default",
  },
  {
    label: "Next week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
      ];
    },
    appearance: "default",
  },
];

const getMonthStartDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const StockSummary = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [stockSummary, setStockSummary] = useState([]);
  const [value, setValue] = useState([getMonthStartDate(), new Date()]);

  const httpErrorHandler = useHttpErrorHandler();

  const fetchData = useCallback(
    async (user, FromDate = new Date(), ToDate = new Date()) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${user?.url}/api/Report/StockSummary`,
          {
            headers: {
              ToDate: dateToNumber(ToDate),
              FromDate: dateToNumber(FromDate),
              Auth: user?.loginResponse?.Authorization,
              Mode: user?.Mode,
              DbKey: user?.DbKey,
              Godown: "*",
              platform: "Web",
              Version: "1.0.0.0",
            },
          }
        );

        if (response && response?.status === 200) {
          setStockSummary(response?.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        httpErrorHandler(error);
      }
    },
    [httpErrorHandler]
  );

  useEffect(() => {
    if (user) {
      fetchData(user, value[0], value[1]);
    }
  }, [user, fetchData, value]);

  console.log("usr", user);

  const handleSearchClick = () => {
    fetchData(user, dateToNumber(value[1]), dateToNumber(value[0]));
  };

  return (
    <>
      <Row className="p-2 m-0">
        <Col xs={3} sm={3} md={3}>
          <DateRangePicker
            ranges={predefinedRanges}
            //   placeholder="Select Date"
            value={value}
            onShortcutClick={(shortcut) => {
              setValue(shortcut?.value);
              // console.log(shortcut);
            }}
            onChange={setValue}
          />
        </Col>
        <Col xs={3} sm={3} md={3}>
          <IconButton
            onClick={handleSearchClick}
            style={{ border: "1px solid gray" }}
            icon={<SearchIcon />}
          />
        </Col>
      </Row>

      <Table aria-label="collapsible table" size="small" className="my-2">
        <TableHead
          style={{
            backgroundColor: "#172B4D",
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Variant
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Open Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Inward Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Outward Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Closing Quantity
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>
                <TableSkeleton />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {stockSummary &&
                stockSummary?.length > 0 &&
                stockSummary?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row?.Name}
                    </TableCell>
                    <TableCell align="right">{row?.Variant}</TableCell>
                    <TableCell align="right">
                      {row?.OpnQty.toFixed(4)}
                    </TableCell>
                    <TableCell align="right">
                      {row?.InwardQty.toFixed(4)}
                    </TableCell>
                    <TableCell align="right">
                      {row?.Quantity.toFixed(4)}
                    </TableCell>
                    <TableCell align="right">
                      {row?.OutwardQty.toFixed(4)}
                    </TableCell>
                    <TableCell align="right">
                      {(row?.Quantity - row?.OutwardQty).toFixed(4)}
                    </TableCell>
                  </StyledTableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default StockSummary;
