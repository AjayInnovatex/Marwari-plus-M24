import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
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
import { formateAmount } from "../../utils/formateAmount";
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

const Ledger = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const ladgerId = searchParams.get("ladgerId");
  const name = searchParams.get("name");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [ladger, setLadgerData] = useState([]);
  const [ladgerGroup, setLadgerGroup] = useState([]);
  const [selectedLadgerGroup, setSelectedLadgerGroup] = useState("");
  const [value, setValue] = useState([getMonthStartDate(), new Date()]);

  const httpErrorHandler = useHttpErrorHandler();

  const fetchLadger = useCallback(
    async (user) => {
      try {
        setLoading(true);
        const response = await axios.get(`${user?.url}/api/Ledger`, {
          headers: {
            Auth: user?.loginResponse?.Authorization,
            DbKey: user?.DbKey,
            platform: "Web",
            Version: "1.0.0.0",
          },
        });

        if (response && response?.status === 200) {
          setLadgerGroup(response?.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        httpErrorHandler(error);
      }
    },
    [httpErrorHandler]
  );

  const fetchData = useCallback(
    async (
      user,
      LedgerId = "",
      ToDate = getMonthStartDate(),
      FromDate = new Date()
    ) => {
      try {
        setLoading(true);
        const [standradTrailResponse] = await Promise.all([
          axios.get(`${user?.url}/api/Report/Ledger`, {
            headers: {
              ToDate: dateToNumber(ToDate),
              FromDate: dateToNumber(FromDate),
              Auth: user?.loginResponse?.Authorization,
              Mode: user?.Mode,
              DbKey: user?.DbKey,
              LedgerId: LedgerId,
              platform: "Web",
              Version: "1.0.0.0",
            },
          }),
        ]);

        if (standradTrailResponse && standradTrailResponse?.status === 200) {
          setLadgerData(standradTrailResponse?.data);
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
      if (!ladgerId && !name) {
        fetchData(user);
      }
      fetchLadger(user);
    }
  }, [user, ladgerId, name, fetchData, fetchLadger]);

  useEffect(() => {
    if (user && ladgerId && name && from && to) {
      const parsedFrom = new Date(from);
      const parsedTo = new Date(to);

      // console.log("parsedTo", parsedTo?.getFullYear());
      // console.log("parsedFrom", parsedFrom?.getFullYear());

      fetchData(user, ladgerId, parsedTo, parsedFrom);
    }
  }, [user, ladgerId, name, from, to, fetchData]);

  const handleSearchClick = () => {
    fetchData(user, selectedLadgerGroup, value[1], value[0]);
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
          <Form.Select
            onChange={(e) => {
              setSelectedLadgerGroup(e.target.value);
            }}
            value={selectedLadgerGroup}
          >
            <option>Select Ladger</option>
            {ladgerGroup &&
              ladgerGroup?.length > 0 &&
              ladgerGroup.map((item) => (
                <option key={item?.Id} value={item?.Id}>
                  {item?.Name}
                </option>
              ))}
          </Form.Select>
        </Col>
        <Col xs={3} sm={3} md={3}>
          <IconButton
            onClick={handleSearchClick}
            style={{ border: "1px solid gray" }}
            icon={<SearchIcon />}
          />
        </Col>
      </Row>

      <Table aria-label="collapsible table" size="small">
        <TableHead
          style={{
            backgroundColor: "#172B4D",
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              Name
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Dr
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Cr
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <TableSkeleton />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {ladger &&
                ladger?.length > 0 &&
                ladger?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row?.Name}
                    </TableCell>
                    <TableCell align="right">
                      {row?.Amount > 0 && formateAmount(Math.abs(row?.Amount))}
                    </TableCell>
                    <TableCell align="right">
                      {row?.Amount < 0 && formateAmount(Math.abs(row?.Amount))}
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

export default Ledger;
