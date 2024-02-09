import Head from 'next/head'
import { LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/solid'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Router from 'next/router';
import { toast } from 'react-toastify';

export default function Create() {
  const { register, handleSubmit } = useForm();
  const [userInfos, setUserInfos] = useState({
    email: '',
    name: '',
    password: ''
  });

  async function handleCreate() {
    api.post('auth/create', userInfos)
    .then(() => {
        Router.push('/');
    })
    .catch(({response}) => {
        toast.error(response.data.message, { autoClose: 1000 });
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Leilão</title>
      </Head>

      <button
        type='button'
        className='absolute top-20 left-32'
        onClick={() => {Router.push('/')}}
      >
        <ArrowLeftIcon className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'/>
      </button>

      <div className="max-w-sm w-full space-y-8">
        <div>
          <img
            className="mx-auto h-24 w-auto"
            src='https://static.vecteezy.com/ti/vetor-gratis/p1/33177445-carro-leilao-icone-vetor.jpg'
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Leilão de carros</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleCreate)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-mail
              </label>
              <input
                {...register('email')}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="E-mail"
                onChange={({ target }) => setUserInfos({ ...userInfos, email: target.value})}
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                {...register('name')}
                id="name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="nome"
                onChange={({ target }) => setUserInfos({ ...userInfos, name: target.value})}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                onChange={({ target }) => setUserInfos({ ...userInfos, password: target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}