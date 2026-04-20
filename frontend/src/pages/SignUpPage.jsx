import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* signup form - left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* {logo} */}

          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatApp
            </span>
          </div>
          {/* error message if any*/}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          {/* signup form */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join chatApp to start chatting with your friends!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* full name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john.doe@example.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs opacity-70">
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                  {/* terms and conditions */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={signupData.termsAccepted}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            termsAccepted: e.target.checked,
                          })
                        }
                        required
                      />
                      <span className="label-text">
                        I agree to the{" "}
                        <a href="/terms" className="link link-hover">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="link link-hover">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </div>
                {/* submit button */}
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                {/* already have an account? */}
                <div className="text-center mt-4">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* signup form - right side  */}

        <div className="hidden lg:flex  w-full lg:w-1/2 bg--primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="Video-call-bro.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-2xl font-bold">
                Connect with Friends worldwide
              </h2>
              <p className="opacity-70">
                Join our community and connect with people from all over the
                world.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SignUpPage;
