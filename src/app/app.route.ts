import { RouterModule, Routes } from '@angular/router';

// dashboard
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { NgModule } from '@angular/core';
import { UserGuard } from './shared/gaurd/auth.guard';

const routes: Routes = [
    {
        path: 'pos',
        children: [
            { path: '', loadChildren: () => import('./pages/POS/posmain-page/posmain-page.module').then(m => m.POSMainPageModule) },
            { path: ':/id', loadChildren: () => import('./pages/POS/posmain-page/posmain-page.module').then(m => m.POSMainPageModule) },
        ]
    },
    {
        path: 'floors',
        children: [
            { path: '', loadChildren: () => import('./pages/POS/tables-view/tables-view.module').then(m => m.TablesViewModule) },
        ]
    },
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'floors',
                children: [
                    { path: '', loadChildren: () => import('./pages/POS/tables-view/tables-view.module').then(m => m.TablesViewModule) },
                ]
            },
            {
                path: 'stock',
                children: [
                    { path: 'items/cu', loadChildren: () => import('./pages/Stock/Items/add-item/add-item.module').then(m => m.AddItemModule) },
                    { path: 'items/cu/:id', loadChildren: () => import('./pages/Stock/Items/add-item/add-item.module').then(m => m.AddItemModule) },
                    { path: 'items', loadChildren: () => import('./pages/Stock/Items/items-list/items-list.module').then(m => m.ItemsListModule) },

                    { path: 'invoices/c/:invCategory', loadChildren: () => import('./pages/Stock/Invoice/add-invoice/add-invoice.module').then(m => m.AddInvoiceModule) },
                    { path: 'invoices/cu/:id', loadChildren: () => import('./pages/Stock/Invoice/add-invoice/add-invoice.module').then(m => m.AddInvoiceModule) },
                    { path: 'invoices', loadChildren: () => import('./pages/Stock/Invoice/invoices-list/invoices-list.module').then(m => m.InvoicesListModule) },
                ]
            },
            {
                path: 'company-info',
                children: [
                    { path: '', loadChildren: () => import('./pages/company-info/company-info.module').then(m => m.CompanyInfoModule) },
                ]
            },
            {
                path: 'accounts',
                children: [
                    { path: 'users', loadChildren: () => import('./pages/Accounts/Users/users-list/users-list.module').then(m => m.UsersListModule) },
                    { path: 'users/cu/:Id', loadChildren: () => import('./pages/Accounts/Users/users-cu/users-cu.module').then(m => m.UsersCuModule) },
                    { path: 'users/cu', loadChildren: () => import('./pages/Accounts/Users/users-cu/users-cu.module').then(m => m.UsersCuModule) },

                    { path: 'suppliers', loadChildren: () => import('./pages/Accounts/Suppliers/suppliers-list/suppliers-list.module').then(m => m.SuppliersListModule) },
                    { path: 'suppliers/cu/:Id', loadChildren: () => import('./pages/Accounts/Suppliers/suppliers-cu/suppliers-cu.module').then(m => m.SuppliersCuModule) },
                    { path: 'suppliers/cu', loadChildren: () => import('./pages/Accounts/Suppliers/suppliers-cu/suppliers-cu.module').then(m => m.SuppliersCuModule) },

                    { path: 'customers', loadChildren: () => import('./pages/Accounts/Customers/customers-list/customers-list.module').then(m => m.CustomersListModule) },
                    { path: 'customers/cu/:Id', loadChildren: () => import('./pages/Accounts/Customers/customers-cu/customers-cu.module').then(m => m.CustomersCuModule) },
                    { path: 'customers/cu', loadChildren: () => import('./pages/Accounts/Customers/customers-cu/customers-cu.module').then(m => m.CustomersCuModule) },


                    { path: 'permissiongroup', loadChildren: () => import('./pages/Accounts/permission-group/permission-group.module').then(m => m.PermissionGroupModule) },
                ]
            },
            {
                path: 'vouchers',
                children: [
                    { path: ':type', loadChildren: () => import('./pages/Vouchers/vochers-list/vochers-list.module').then(m => m.VochersListModule) }
                ]
            },
            {
                path: 'shifts',
                children: [
                    { path: '', loadChildren: () => import('./pages/Shifts/shifts-list/shifts-list.module').then(m => m.ShiftsListModule) },
                    { path: 'cu/:id', loadChildren: () => import('./pages/Shifts/shifts-cu/shifts-cu.module').then(m => m.ShiftsCuModule) },
                ]
            },
            {
                path: 'reports',
                children: [
                    { path: 'accountstatement', loadChildren: () => import('./pages/Reports/account-statements/account-statements.module').then(m => m.AccountStatementsModule) },
                    { path: 'stockreport', loadChildren: () => import('./pages/Reports/stock-report/stock-report.module').then(m => m.StockReportModule) },
                ]
            },
            {
                path: 'system',
                children: [
                    { path: 'lookups', loadChildren: () => import('./pages/System/lookups/lookups.module').then(m => m.LookupsModule) },
                    { path: 'departments/cu', loadChildren: () => import('./pages/System/Departments/department-cu/department-cu.module').then(m => m.DepartmentCuModule) },
                    { path: 'departments/cu/:id', loadChildren: () => import('./pages/System/Departments/department-cu/department-cu.module').then(m => m.DepartmentCuModule) },
                    { path: 'departments', loadChildren: () => import('./pages/System/Departments/department-list/department-list.module').then(m => m.DepartmentListModule) },

                    { path: 'floors/cu', loadChildren: () => import('./pages/System/Floors/add-floor/add-floor.module').then(m => m.AddFloorModule) },
                    { path: 'floors/cu/:id', loadChildren: () => import('./pages/System/Floors/add-floor/add-floor.module').then(m => m.AddFloorModule) },
                    { path: 'floors', loadChildren: () => import('./pages/System/Floors/floors-list/floors-list.module').then(m => m.FloorsListModule) },
                ]
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
        data: {
            roles: ['admin']
        },
        canActivate: [UserGuard]
    },
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', loadChildren: () => import('./pages/Auth/login/login.module').then(m => m.LoginModule) },
            { path: 'loginPos', loadChildren: () => import('./pages/Auth/pos-login/pos-login.module').then(m => m.PosLoginModule) },
            { path: 'reset-password', loadChildren: () => import('./pages/Auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
            { path: 'reset-password/:userId/:tempTokenCode', loadChildren: () => import('./pages/Auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) }
        ],
    },
    { path: 'components/PosStockReport', loadChildren: () => import('./components/pos-stock-report/pos-stock-report.module').then(m => m.PosStockReportModule) },
    { path: 'components/PosSwitchAccount', loadChildren: () => import('./components/pos-switch-account/pos-switch-account.module').then(m => m.PosSwitchAccountModule) },
    { path: 'components/PosExpenses/PosExpensesList', loadChildren: () => import('./components/PosExpenses/pos-expenses-list/pos-expenses-list.module').then(m => m.PosExpensesListModule) },
    { path: 'components/PosExpenses/PosAddExpenses', loadChildren: () => import('./components/PosExpenses/pos-add-expenses/pos-add-expenses.module').then(m => m.PosAddExpensesModule) },
    { path: 'components/DeliveryCustomer', loadChildren: () => import('./components/delivery-customer/delivery-customer.module').then(m => m.DeliveryCustomerModule) },
    { path: 'components/PosOrderDetails', loadChildren: () => import('./components/pos-order-details/pos-order-details.module').then(m => m.PosOrderDetailsModule) },
    { path: 'components/PosItemsSearch', loadChildren: () => import('./components/pos-items-search/pos-items-search.module').then(m => m.PosItemsSearchModule) },
    { path: 'pages/Accounts/PermissionGroup', loadChildren: () => import('./pages/Accounts/permission-group/permission-group.module').then(m => m.PermissionGroupModule) },
    { path: 'pages/Accounts/permission-group/PermissionForm', loadChildren: () => import('./pages/Accounts/permission-group/permission-form/permission-form.module').then(m => m.PermissionFormModule) },
    { path: 'components/PosReports', loadChildren: () => import('./components/pos-reports/pos-reports.module').then(m => m.PosReportsModule) },
    { path: 'components/PosBarcodeReader', loadChildren: () => import('./components/pos-barcode-reader/pos-barcode-reader.module').then(m => m.PosBarcodeReaderModule) },
    { path: 'components/PosApplyDiscount', loadChildren: () => import('./components/pos-apply-discount/pos-apply-discount.module').then(m => m.PosApplyDiscountModule) },
    { path: 'components/Display/PosDiscountCardShow', loadChildren: () => import('./components/Display/pos-discount-card-show/pos-discount-card-show.module').then(m => m.PosDiscountCardShowModule) },
    { path: 'components/PosRemoveInvoice', loadChildren: () => import('./components/pos-remove-invoice/pos-remove-invoice.module').then(m => m.PosRemoveInvoiceModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
