import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useParams } from "react-router-dom";
import PaperLayout from "~/components/PaperLayout/PaperLayout";
import { useAvailableProduct } from "~/queries/products";
import { formatAsPrice } from "~/utils/utils";

export default function PageProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useAvailableProduct(id);

  if (isLoading) {
    return (
      <PaperLayout>
        <Typography>Loading...</Typography>
      </PaperLayout>
    );
  }

  if (!product) {
    return (
      <PaperLayout>
        <Typography component="h1" variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to products
        </Button>
      </PaperLayout>
    );
  }

  return (
    <PaperLayout>
      <Typography component="h1" variant="h4" gutterBottom>
        {product.title}
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom>
        {formatAsPrice(product.price)}
      </Typography>
      <Typography variant="body1">{product.description}</Typography>
      <Box mt={3}>
        <Button component={RouterLink} to="/" variant="outlined">
          Back to products
        </Button>
      </Box>
    </PaperLayout>
  );
}
