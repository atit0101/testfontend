"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// interface Iitem {
//   item: string[];
// }
interface Iform {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  item: string[];
}



const schema = yup
  .object({
    firstname: yup.string().required("Firstname is required !!!"),
    lastname: yup.string().required("Lastname is required !!!"),
    email: yup.string().email().required("Email is required !!!"),
    username: yup.string().required("Username is required !!!"),
    password: yup.string().min(8).required()
  })
  .required();

export default function page() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Iform>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<Iform> = (data) => console.log(data);

  const checkbox_data = ["React", "Next.js", "Laravel", "GraphQL", "Nest.js"];

  // const seletedd = () => (
  //   register.ite
  // )
  return (

    <>
      <div className="flex content-center flex-wrap bg-gray-200 h-screen">
        <div className="w-full">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Firstname
                </label>
                <input {...register("firstname")} name='firstname' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Firstname"></input>
                {
                  errors.firstname && (
                    <p style={{ color: 'red', margin: '0', fontSize: '15px' }}>
                      {errors.firstname.message}
                    </p>
                  )
                }
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Lastname
                </label>
                <input  {...register("lastname")} name='lastname' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Lastname"></input>
                {
                  errors.lastname && (
                    <p style={{ color: 'red', margin: '0', fontSize: '15px' }}>
                      {errors.lastname.message}
                    </p>
                  )
                }
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input {...register("email")} name='email' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="email" placeholder="Email"></input>
                {
                  errors.email && (
                    <p style={{ color: 'red', margin: '0', fontSize: '15px' }}>
                      {errors.email.message}
                    </p>
                  )
                }
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input {...register("username")} name='username' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
                {
                  errors.username && (
                    <p style={{ color: 'red', margin: '0', fontSize: '15px' }}>
                      {errors.username.message}
                    </p>
                  )
                }
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input {...register("password")} name='password' className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                {
                  errors.password && (
                    <p style={{ color: 'red', margin: '0', fontSize: '15px' }}>
                      {errors.password.message}
                    </p>
                  )
                }
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Programming language
                </label>

                <fieldset name='item'>
                  <legend className="sr-only">Checkbox variants</legend>
                  {
                    checkbox_data.map((e,i) => (
                      <div className="flex items-center mb-4" key={e}>
                        <input {...register("item")} id={e} type="checkbox" value={e} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label   className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-950">
                          {e}
                        </label>
                      </div>
                    ))
                  }

                </fieldset>

              </div>

              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>




    </>
  );
}
