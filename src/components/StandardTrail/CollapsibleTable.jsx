import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import useHttpErrorHandler from "../../utils/userHttpErrorHandler";
import { formateAmount } from "../../utils/formateAmount";

import { dateToNumber } from "../../utils/dateToNumber";

const Row = ({ row, level = 0, standardTrailData, date }) => {
  const { ladgerGroupId } = useParams();
  const [open, setOpen] = useState(false);
  const [standardTrail, setStandardTrail] = useState([]);
  const [totalAmonunt, setTotalAmount] = useState({
    name: "",
    Dr: 0,
    Cr: 0,
  });
  const { user } = useSelector((state) => state.auth);

  const httpErrorHandler = useHttpErrorHandler();

  const handleArrowClick = async (ladgerGroupId, name) => {
    try {
      const response = await axios.get(
        `${user?.url}/api/Report/StandardTrialDetailed`,
        {
          headers: {
            ToDate: dateToNumber(date[1]),
            Auth: user?.loginResponse?.Authorization,
            Mode: user?.Mode,
            DbKey: user?.DbKey,
            GroupId: ladgerGroupId + ";",
            platform: "Web",
            Version: "1.0.0.0",
          },
        }
      );

      if (response && response.status === 200) {
        const detailsData = response.data;

        let filteredData = [...detailsData];

        if (
          filteredData &&
          filteredData?.length > 0 &&
          standardTrailData &&
          standardTrailData?.length > 0
        ) {
          for (let filterItem of filteredData) {
            const filtered = standardTrailData.filter((item) =>
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
          }

          // const filtered = standardTrailData.filter((item) =>
          //   item.HierarchyId.split(";").includes(row?.Id)
          // );

          // console.log("row", row);
          // console.log("filtered", filtered);

          // let amount = 0;

          // filtered.forEach((data) => {
          //   amount += data?.Amount;
          // });

          // row.Amount = amount;
        }

        // console.log("row", row);

        if (ladgerGroupId && filteredData && filteredData.length > 0) {
          filteredData = filteredData.filter(
            (item) => item.Id !== ladgerGroupId
          );

          const ladgerData = standardTrailData.filter(
            (item) => item.LedgerGroupId === ladgerGroupId
          );

          filteredData.push(...ladgerData);
        }

        let Cr = 0;
        let Dr = 0;

        filteredData.forEach((data) => {
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

        setTotalAmount({ name, Dr, Cr });
        setStandardTrail(filteredData);
        setOpen(!open);
      }
    } catch (error) {
      console.log("object", error);
      httpErrorHandler(error);
    }
  };

  useEffect(() => {
    setStandardTrail([]);
    setOpen(false);
  }, [ladgerGroupId]);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          {row?.Id && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleArrowClick(row?.Id, row?.LedgerGroup)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell align="left" style={{ fontWeight: row?.Id ? "bold" : "" }}>
          {row?.Id && (
            <Link
              to={`/standard-trail/${row?.Id}/${encodeURIComponent(
                row?.LedgerGroup
              )}`}
            >
              {row?.LedgerGroup}
            </Link>
          )}
          {row?.LedgerId && (
            <Link
              to={`/ledger?ladgerId=${row?.LedgerId}&name=${encodeURIComponent(
                row?.Ledger
              )}&from=${date[0]}&to=${date[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row?.Ledger}
            </Link>
          )}
        </TableCell>
        <TableCell align="right">
          {row?.Amount?.Dr
            ? row?.Amount?.Dr > 0
              ? formateAmount(row?.Amount?.Dr)
              : "-"
            : row?.Amount > 0
            ? formateAmount(row?.Amount)
            : "-"}
        </TableCell>
        <TableCell align="right">
          {row?.Amount?.Cr
            ? row?.Amount?.Cr < 0
              ? formateAmount(Math.abs(row?.Amount?.Cr))
              : "-"
            : row?.Amount < 0
            ? formateAmount(Math.abs(row?.Amount))
            : "-"}
        </TableCell>
      </TableRow>

      {standardTrail && standardTrail?.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
                <Table size="small" aria-label="purchases">
                  <TableHead
                    style={{
                      backgroundColor: "#021f3cc2",
                    }}
                  >
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                        {totalAmonunt?.name
                          ? totalAmonunt?.name
                          : "Ledger Group"}
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
                    {standardTrail.map((item, index) => (
                      <Row
                        key={index}
                        row={item}
                        date={date}
                        standardTrailData={standardTrailData}
                        level={level + 1}
                      />
                    ))}

                    {standardTrail?.length > 0 && (
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
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.object.isRequired,
  standardTrailData: PropTypes.array.isRequired,
};

export default Row;
