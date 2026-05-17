import React from "react";
import API_PATHS from "~/constants/apiPaths";
import ProductsTable from "~/components/pages/admin/PageProductImport/components/ProductsTable";
import CSVFileImport from "~/components/pages/admin/PageProductImport/components/CSVFileImport";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

export default function PageProductImport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onUploadSuccess = React.useCallback(() => {
    const refetchProducts = () => {
      queryClient.refetchQueries("available-products", {
        exact: true,
        active: true,
        inactive: true,
      });
    };

    refetchProducts();
    [2000, 6000, 12000, 20000].forEach((delayMs) => {
      window.setTimeout(refetchProducts, delayMs);
    });

    navigate("/admin/products");
  }, [navigate, queryClient]);

  return (
    <Box py={3}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <CSVFileImport
          url={`${API_PATHS.import}/import`}
          title="Import Products CSV"
          onUploadSuccess={onUploadSuccess}
        />
        <Button
          size="small"
          color="primary"
          variant="contained"
          sx={{ alignSelf: "end" }}
          component={Link}
          to={"/admin/product-form"}
        >
          Create product
        </Button>
      </Box>
      <ProductsTable />
    </Box>
  );
}
