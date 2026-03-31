import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AuthLayout from '~/layouts/AuthLayout'
import AppLoading from '~/components/sections/AppLoading'

const Login = lazy(() => import('~/views/Login'))
const NotFound = lazy(() => import('~/views/NotFound'))
const Home = lazy(() => import('~/views/Home'))
const Profile = lazy(() => import('~/views/Profile'))
const Branch = lazy(() => import('~/views/Branch'))
const Customer = lazy(() => import('~/views/Customer'))
const User = lazy(() => import('~/views/User'))
const Property = lazy(() => import('~/views/Property'))
const ListProduct = lazy(() => import('~/views/Product/ListProduct'))
const CreateProduct = lazy(() => import('~/views/Product/CreateProduct'))
const EditProduct = lazy(() => import('~/views/Product/EditProduct'))
const ProductDetail = lazy(() => import('~/views/Product/ProductDetail'))
const ProductCategory = lazy(() => import('~/views/Product/ProductCategory'))
const ListDebt = lazy(() => import('~/views/Debt/ListDebt'))
const AddDebt = lazy(() => import('~/views/Debt/AddDebt'))
const EditDebt = lazy(() => import('~/views/Debt/EditDebt'))
const DebtDetail = lazy(() => import('~/views/Debt/DebtDetail'))
const ListInvoice = lazy(() => import('~/views/Invoice/ListInvoice'))
const AddInvoice = lazy(() => import('~/views/Invoice/AddInvoice'))
const EditInvoice = lazy(() => import('~/views/Invoice/EditInvoice'))
const InvoiceDetail = lazy(() => import('~/views/Invoice/InvoiceDetail'))
const SiteContact = lazy(() => import('~/views/SiteManagement/SiteContact'))
const SitePartner = lazy(() => import('~/views/SiteManagement/SitePartner'))
const SiteProductCategory = lazy(() => import('~/views/SiteManagement/SiteProductCategory'))
const SiteSetting = lazy(() => import('~/views/SiteManagement/SiteSetting'))

export default function App() {
  return (
    <Suspense fallback={<AppLoading forceShow />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/users" element={<User />} />
          <Route path="/property" element={<Property />} />
          <Route path="/product/list" element={<ListProduct />} />
          <Route path="/product/create" element={<CreateProduct />} />
          <Route path="/product/edit/:id" element={<EditProduct />} />
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/product/category" element={<ProductCategory />} />
          <Route path="/debt/list" element={<ListDebt />} />
          <Route path="/debt/add" element={<AddDebt />} />
          <Route path="/debt/edit/:id" element={<EditDebt />} />
          <Route path="/debt/detail/:id" element={<DebtDetail />} />
          <Route path="/invoice/list" element={<ListInvoice />} />
          <Route path="/invoice/add" element={<AddInvoice />} />
          <Route path="/invoice/edit/:id" element={<EditInvoice />} />
          <Route path="/invoice/detail/:id" element={<InvoiceDetail />} />
          <Route path="/sm/contact" element={<SiteContact />} />
          <Route path="/sm/partner" element={<SitePartner />} />
          <Route path="/sm/product-category" element={<SiteProductCategory />} />
          <Route path="/sm/setting" element={<SiteSetting />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
