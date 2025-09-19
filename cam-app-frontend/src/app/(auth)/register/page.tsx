import { Box, Grid, Link, Typography } from '@mui/material'
import React from 'react'
import SignUpForm from './signup-form'

export default function SignUpPage() {
  return (
   <>
   <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
      
      </Typography>
      <Typography variant="caption" color="secondary.light" textAlign="center">
        Please sign-up to your account
      </Typography>
          <SignUpForm />
        <Box >
        <Grid container>
          <Grid textAlign="center">
            <Typography variant="caption" color={"secondary.light"}>
              Already have an account?
            </Typography>
            <Link 
            href="/login"
            sx={{ cursor: "pointer" }} variant="body2">
              {"Sign In"}
            </Link>
          </Grid>
        </Grid>
        </Box>
      
    </Box>
   </>
  )
}
