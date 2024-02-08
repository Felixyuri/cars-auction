import { Fragment, useContext, useState } from 'react'
import Head from 'next/head'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthContext } from '../../contexts/AuthContext'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import { getAPIClient } from '../../services/axios'
import TableAuctions from '../../components/TableAuctions'
import CreateAuction from '../../components/CreateAuction'

const navigation = ['Dashboard', 'Criar']

export default function Dashboard({ auctions }: any) {
  const [showModalCreateAuction, setShowModalCreateAuction] = useState<boolean>(false);
  const [allAuctions, setAllAuctions] = useState(auctions);

  const signOut = () => {
    destroyCookie(null, 'carsauth.token');
    Router.push('/');
  }

  const handleAuctionCreated = (newAuctionData: any) => {
    setAllAuctions([...allAuctions, newAuctionData]);
  };

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://i.pinimg.com/474x/54/bc/10/54bc10948c957683d0a0e653422d9c7f.jpg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) => {
                        return itemIdx === 0 ? (
                          <Fragment key={item}>
                            <a href="#" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                              {item}
                            </a>
                          </Fragment>
                        ) : (
                          <Fragment key={item}>
                            <a
                              onClick={() => setShowModalCreateAuction(true)}
                              className="text-gray-300 cursor-pointer hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              {item}
                            </a>
                          </Fragment>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <a
                                onClick={() => signOut()}
                                className='block px-4 py-2 font-bold text-sm text-red-600'
                              >
                                Sign out
                              </a>
                            </Menu.Button>
                          </div>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  itemIdx === 0 ? (
                    <Fragment key={item}>
                      <a href="#" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                        {item}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item}
                      href="#"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="mt-3 px-2 space-y-1">
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <CreateAuction
        showModal={showModalCreateAuction}
        setShowModal={setShowModalCreateAuction}
        setAllAuctions={handleAuctionCreated}
      />

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Leilões ativos:</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <TableAuctions auctions={allAuctions} />
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let auctions;
  const apiClient = getAPIClient(ctx);
  const { ['carsauth.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  await apiClient.get('/auction')
  .then(({data}) => {
    auctions = data;
  })
  .catch(({response}) => {});

  return {
    props: {
      auctions: auctions
    }
  }
}