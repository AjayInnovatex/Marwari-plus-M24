import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
import "./StandardTrail.css";

import TableSkeleton from "../../Skeleton/TableSkeleton";

import TableRowData from "./CollapsibleTable";
import useHttpErrorHandler from "../../utils/userHttpErrorHandler";
import { dateToNumber } from "../../utils/dateToNumber";

import { formateAmount } from "../../utils/formateAmount";

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

const StandardTrail = () => {
  const navigate = useNavigate();
  const { ladgerGroupId, name } = useParams();

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [standardTrailData, setStandardaTrailData] = useState([]);
  const [totalAmonunt, setTotalAmount] = useState({
    Dr: 0,
    Cr: 0,
  });
  const [standardaTrailDetailedData, setStandardaTrailDetailedData] = useState(
    []
  );
  const [selectedLadgerGroup, setSelectedLadgerGroup] = useState("");
  const [showType, setShowType] = useState("");
  const [value, setValue] = useState([getMonthStartDate(), new Date()]);

  const httpErrorHandler = useHttpErrorHandler();

  const fetchStandardTrails = useCallback(
    async (user, ladgerGroup = "", ToDate = new Date()) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${user?.url}/api/Report/StandardTrial`,
          {
            headers: {
              ToDate: dateToNumber(ToDate),
              Auth: user?.loginResponse?.Authorization,
              Mode: user?.Mode,
              DbKey: user?.DbKey,
              GroupId: ladgerGroup,
              platform: "Web",
              Version: "1.0.0.0",
            },
          }
        );

        if (response && response?.status === 200) {
          setStandardaTrailData(response?.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        httpErrorHandler(error);
      }
    },
    [httpErrorHandler]
  );

  const fetchStandardTrailDetails = useCallback(
    async (
      user,
      standardTrail = [],
      ladgerGroup = "",
      showType = "",
      ToDate = new Date()
    ) => {
      try {
        console.log("object", ToDate);

        setLoading(false);
        const response = await axios.get(
          `${user?.url}/api/Report/StandardTrialDetailed`,
          {
            headers: {
              ToDate: dateToNumber(ToDate),
              Auth: user?.loginResponse?.Authorization,
              Mode: user?.Mode,
              DbKey: user?.DbKey,
              GroupId: ladgerGroup + ";",
              platform: "Web",
              Version: "1.0.0.0",
            },
          }
        );

        if (response && response.status === 200) {
          const detailsData = response.data;

          let filteredData = [];

          if (!ladgerGroupId && detailsData && detailsData.length > 0) {
            filteredData = detailsData.filter((item) => !item.Under);
          } else {
            filteredData = detailsData;
          }

          if (
            filteredData &&
            filteredData?.length > 0 &&
            standardTrail &&
            standardTrail?.length > 0
          ) {
            for (let filterItem of filteredData) {
              const filtered = standardTrail.filter((item) =>
                item.HierarchyId.split(";").includes(filterItem?.Id)
              );

              let Dr = 0;
              let Cr = 0;

              filtered.forEach((data) => {
                if (data?.Amount > 0) {
                  Dr += data?.Amount;
                } else if (data?.Amount) {
                  Cr += data?.Amount;
                }
              });

              filterItem.Amount = { Dr, Cr };

              // let amount = 0;

              // filtered.forEach((data) => {
              //   amount += data?.Amount;
              // });

              // filterItem.Amount = amount;
            }
          }

          if (ladgerGroupId && filteredData && filteredData.length > 0) {
            filteredData = filteredData.filter(
              (item) => item.Id !== ladgerGroupId
            );

            const ladgerData = standardTrail.filter(
              (item) => item.LedgerGroupId === ladgerGroupId
            );

            filteredData.push(...ladgerData);
          }

          if (showType !== "0") {
            filteredData = filteredData?.filter(
              (item) => Math.abs(item?.Amount) !== 0
            );
          }
          setStandardaTrailDetailedData(filteredData);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        httpErrorHandler(error);
      }
    },
    [httpErrorHandler, ladgerGroupId]
  );

  useEffect(() => {
    if (standardaTrailDetailedData && standardaTrailDetailedData?.length > 0) {
      let Cr = 0;
      let Dr = 0;

      standardaTrailDetailedData.forEach((data) => {
        if (data?.Amount?.Cr && data?.Amount?.Cr <= 0) {
          Cr += data?.Amount?.Cr;
        } else if (data?.Amount && data?.Amount <= 0) {
          Cr += data?.Amount;
        }

        if (data?.Amount?.Dr && data?.Amount?.Dr > 0) {
          Dr += data?.Amount?.Dr;
        } else if (data?.Amount && data?.Amount > 0) {
          Dr += data?.Amount;
        }
      });

      // standardaTrailDetailedData.forEach((data) => {
      //   if (data?.Amount > 0) {
      //     Dr += data?.Amount;
      //   } else {
      //     Cr += data?.Amount;
      //   }
      // });
      setTotalAmount({ Dr, Cr });
    }
  }, [standardaTrailDetailedData]);

  useEffect(() => {
    if (user && !ladgerGroupId) {
      Promise.all([
        fetchStandardTrails(user),
        // fetchLadgerGroup(user),
      ]);
    }

    if (user && ladgerGroupId) {
      Promise.all(fetchStandardTrails(user, ladgerGroupId));
    }
  }, [
    user,
    // standardTrailData,
    fetchStandardTrails,
    // fetchLadgerGroup,
    ladgerGroupId,
  ]);

  useEffect(() => {
    if (user && !ladgerGroupId && standardTrailData?.length > 0) {
      fetchStandardTrailDetails(user, standardTrailData);
    }
  }, [user, ladgerGroupId, standardTrailData, fetchStandardTrailDetails]);

  useEffect(() => {
    if (user && ladgerGroupId && standardTrailData?.length > 0) {
      fetchStandardTrailDetails(user, standardTrailData, ladgerGroupId);
    }
  }, [user, ladgerGroupId, standardTrailData, fetchStandardTrailDetails]);

  const handleSearchClick = () => {
    Promise.all([
      fetchStandardTrailDetails(
        user,
        standardTrailData,
        selectedLadgerGroup,
        showType,
        value[1]
      ),
    ]);

    const [id, name] = selectedLadgerGroup?.split(",") || "";

    if (id && name) {
      navigate(`/standard-trail/${id}/${name}`);
    }

    if (!showType) {
      fetchStandardTrails(user, selectedLadgerGroup, value[1]);
    }
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
            value={selectedLadgerGroup}
            onChange={(e) => {
              setSelectedLadgerGroup(e.target.value);
            }}
          >
            <option>Select Ladger Group</option>
            {standardaTrailDetailedData &&
              standardaTrailDetailedData?.length > 0 &&
              standardaTrailDetailedData.map((item, index) => (
                <option key={index} value={`${item?.Id},${item?.LedgerGroup}`}>
                  {item?.LedgerGroup}
                </option>
              ))}
          </Form.Select>
        </Col>
        <Col xs={3} sm={3} md={3}>
          <Form.Select
            value={showType}
            onChange={(e) => {
              setShowType(e.target.value);
            }}
          >
            <option value="">Select Option</option>
            <option value="0">Show All</option>
            <option value="1">Select Zero Only</option>
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
            <TableCell />
            <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
              {name ? name : "Ledger Group"}
            </TableCell>
            {/* <TableCell
              align="left"
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Ledger
            </TableCell> */}
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
              {standardaTrailDetailedData &&
                standardaTrailDetailedData?.length > 0 &&
                standardaTrailDetailedData?.map((row, index) => (
                  <TableRowData
                    key={index}
                    row={row}
                    ToDate={value[1]}
                    ladgerGroup={selectedLadgerGroup}
                    standardTrailData={standardTrailData}
                    level={0}
                    date={value}
                  />
                ))}

              {ladgerGroupId &&
                standardaTrailDetailedData &&
                standardaTrailDetailedData?.length > 0 && (
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align="center"
                      colSpan="2"
                    >
                      Total
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      {totalAmonunt?.Dr === 0
                        ? "-"
                        : formateAmount(totalAmonunt?.Dr)}
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      {Math.abs(totalAmonunt?.Cr) === 0
                        ? "-"
                        : formateAmount(Math.abs(totalAmonunt?.Cr))}
                    </TableCell>
                  </TableRow>
                )}
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default StandardTrail;
