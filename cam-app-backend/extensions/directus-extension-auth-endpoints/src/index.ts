import { Router, Request } from "express";
import { Accountability, SchemaOverview } from "@directus/types";
import { authentication, createDirectus, readMe, rest } from "@directus/sdk";
import { Schema } from "../../../Schema";
import { generateMfaCode } from "./utils";

interface MfaRequest extends Request {
  body: {
    email: string;
    password: string;
    remember?: boolean;
    id?: string;
    mfa_code?: string;
  };
  accountability: Accountability;
  schema: SchemaOverview;
}

const authModule = {
  id: "auth",
  handler: (router: Router, { env, services }: any) => {
    const { UsersService, MailService } = services;
    const directus = createDirectus<Schema>(env.PUBLIC_URL)
      .with(rest({ credentials: "include" }))
      .with(authentication("json", { credentials: "include" }));

    router.post("/mfa", async (req: MfaRequest, res: any) => {
      let loggedInUser: any = null;
      try {
        const { email, password } = req.body;
        loggedInUser = await directus.login({ email, password });

        const usersService = new UsersService({ schema: req.schema });
        const mailService = new MailService({ schema: req.schema });

        if (loggedInUser) {
          const user = await directus.request(
            readMe({
              fields: ["id"],
            })
          );
          const mfaData = {
            mfa_code: generateMfaCode(),
            mfa_code_expiry: new Date(
              Date.now() + env.EMAIL_MFA_EXPIRY_MINUTES * 60 * 1000
            ).toISOString(), // 3 minutes
          };
          await usersService.updateOne(user.id, mfaData);
          console.log(`Your MFA code is: ${mfaData.mfa_code}`);
        //   mailService
        //     .send({
        //       to: email,
        //       subject: "XCams: Your Secure Sign-In Code",
        //       html: `<main style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333333;">
        //         <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; border-radius: 8px;">
        //             <div style="background-color: #7dbb00; color: #ffffff; padding: 20px; text-align: center;">
        //                 <h1 style="margin: 0;">XCams</h1>
        //             </div>
        //             <div style="padding: 20px; text-align: center; border: 1px solid lightgray;">
        //                 <p style="margin: 0 0 20px 0;">Hi, Your Multi-Factor Authentication (MFA) code is:</p>
        //                 <div style="display: inline-block; padding: 10px 20px; font-size: 24px; color: #ffffff; background-color: #000000; border-radius: 5px; margin: 20px 0;">${
        //                   mfaData.mfa_code
        //                 }</div>
        //                 <p style="margin: 20px 0;">Please enter this code in the XCams app to complete your sign-in process.</p>
        //                 <p style="margin: 20px 0;">Please note this code will expire in ${
        //                   env.EMAIL_MFA_EXPIRY_MINUTES
        //                 } minutes at (${mfaData.mfa_code_expiry}).</p>
        //                 <p style="margin: 20px 0;">If you did not request this code, please ignore this email or contact our support team.</p>
        //             </div>
        //             <div style="background-color: #f4f4f4; color: #777777; text-align: center; padding: 10px; font-size: 12px;">
        //                 <p style="margin: 0;">&copy; ${new Date().getFullYear()} XCams. All rights reserved.</p>
        //             </div>
        //         </div>
        //     </main>`,
        //     })
        //     .catch((error: any) => {
        //       console.error("Error sending email:", error);
        //     });
          res.status(200).json({
            mfa_code_expiry: mfaData.mfa_code_expiry || "",
          });
        }
      } catch (error: any) {
        console.error("Error handling auth/mfa:", error);
        res.status(400).json({
          error: error.message || error,
        });
      }
    });

    router.post("/mfa/login", async (req: MfaRequest, res: any) => {
      try {
        const { email, password, mfa_code } = req.body;
      console.log("Body:", req.body);
        const loggedInUser: any = await directus.login({ email, password });
        if (loggedInUser) {
          const user = await directus.request(
            readMe({
              fields: [
                "id",
                "mfa_code",
                "mfa_code_expiry",
                "first_name",
                "last_name",
                "email",
                {
                  // @ts-ignore
                  role: ["name"],
                },
              ],
            })
          );

          if (!user.mfa_code) {
            throw new Error(
              "Your request to join the XCams App is currently pending approval. Please wait or reach out to us at: amirhussain9351@gmail.com"
            );
          }
		console.log("User:", user);
		  if (!mfa_code || +user.mfa_code !== +mfa_code) {
            throw new Error("Invalid MFA code");
          } else if (
            !user.mfa_code_expiry ||
            new Date(user.mfa_code_expiry) < new Date()
          ) {
            throw new Error(
              "MFA code has expired. Refresh the page and relogin to get a new code."
            );
          } else {
            res.status(200).json({
              message: "Successfully signed in.",
              ...loggedInUser,
              refresh_token_expires_at: new Date(
                Date.now() + env.REFRESH_TOKEN_TTL * 24 * 60 * 1000
              ),
              ...user,
            });
          }
        }
      } catch (error: any) {
        console.error("Error handling auth/login:", error);
        res.status(400).json({
          error: error.message || error,
        });
      }
    });
  },
};

export default authModule;
