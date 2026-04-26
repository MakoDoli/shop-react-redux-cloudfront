import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Cart from "~/components/MainLayout/components/Cart";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = true;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link
            component={RouterLink}
            sx={{ color: "inherit" }}
            underline="none"
            to="/"
          >
            My awesome Store!
          </Link>
        </Typography>

        <Button
          component={RouterLink}
          to="/admin/product-form"
          color="inherit"
          sx={{ mr: 1 }}
        >
          Add Product
        </Button>

        <Button
          component={RouterLink}
          to="/admin/products"
          color="inherit"
          sx={{ mr: 1 }}
        >
          Dashboard
        </Button>

        {auth && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              size="large"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                component={RouterLink}
                to="/admin/orders"
                onClick={handleClose}
              >
                Manage orders
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/admin/products"
                onClick={handleClose}
              >
                Manage products
              </MenuItem>
            </Menu>
          </div>
        )}
        <Cart />
      </Toolbar>
    </AppBar>
  );
}
