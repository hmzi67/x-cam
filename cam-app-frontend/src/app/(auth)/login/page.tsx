import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginForm from "./login-form";

export default async function LoginPage() {

  return (
    <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
      Welcome 👋🏻
      </Typography>
      <Typography variant="caption" color="secondary.light" >
        Please sign-in to your account
      </Typography>
      <LoginForm />
      <Box >
       
        <Grid container>
          <Grid>
            <Typography variant="caption" color={"secondary.light"}>
              Don&apos;t have an account?
            </Typography>
            <Link 
            href="/register"
            sx={{ cursor: "pointer" }} variant="body2">
              {"Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
