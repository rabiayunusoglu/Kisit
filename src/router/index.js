import Vue from 'vue'
import Router from 'vue-router'
import CONFIG from "@/config.json";
import axios from "axios";
import ServiceToken from '../service/TokenService';

// Containers
const TheContainer = () =>
    import('@/containers/TheContainer')
const TheContainerUser = () =>
    import('@/containers/TheContainerUser')

// Views
const Dashboard = () =>
    import('@/views/Dashboard')
const DashboardUser = () =>
    import('@/views/DashboardUser')


// Views - Pages

const Login = () =>
    import('@/views/pages/Login')

const Kisit = () =>
    import('@/views/pages/Kisit')
const Montage = () =>
    import('@/views/pages/MontagePlan')
const Tree = () =>
    import('@/views/pages/ProductTree')
const SorumluBireyler = () =>
    import('@/views/pages/ChargePerson')
const CompanyTeam = () =>
    import('@/views/pages/CompanyTeam')
const DelayReason = () =>
    import('@/views/pages/DelayReason')
const VersionInfo = () =>
    import('@/views/pages/Version')
const ExcelMontage = () =>
    import('@/views/pages/ExcelMontage')
const ExcelTree = () =>
    import('@/views/pages/ExcelTree')
const NoMarkedConstraint = () =>
    import('@/views/pages/NoMarkedConstraint')
const MarkedConstraint = () =>
    import('@/views/pages/MarkedConstraint')
const ArchiveConstraint = () =>
    import('@/views/pages/ArchiveConstraint')
const DelayHistory = () =>
    import('@/views/pages/DelayHistory')

const Meeting = () =>
    import('@/views/pages/Meeting')
const ZKP = () =>
    import('@/views/pages/ZKPChanged')
const Register = () =>
    import('@/views/pages/Register')
const Users = () =>
    import('@/views/pages/Users')
const MeetingTeam = () =>
    import('@/views/pages/MeetingTeam')
const ReportTeam = () =>
    import('@/views/pages/ReportMeetingTeam')



Vue.use(Router)

const router = new Router({
    mode: 'history',
    hash: false,
    linkActiveClass: 'active',
    scrollBehavior: () => ({ y: 0 }),
    routes: configRoutes()
})

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',
            name: 'Ana Sayfa',
            component: TheContainer,
            children: [{
                path: 'dashboard',
                name: 'Ana Sayfa',
                component: Dashboard,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'noMarkedConstraint',
                name: 'İşaretlenmemiş Kısıtlar',
                component: NoMarkedConstraint,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'markedConstraint',
                name: 'İşaretlenmiş Kısıtlar',
                component: MarkedConstraint,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'archiveConstraint',
                name: 'Arşivlenmiş Kısıtlar',
                component: ArchiveConstraint,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'kisit',
                name: 'Kısıt Giriş',
                component: Kisit,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'register',
                name: 'Kayıt',
                component: Register,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'users',
                name: 'Kullanıcılar',
                component: Users,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'delayHistory',
                name: 'Öteleme Geçmişleri',
                component: DelayHistory,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
           
            {
                path: 'montage',
                name: 'Montaj Üretim Planı',
                component: Montage,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'tree',
                name: 'Ürün Ağacı',
                component: Tree,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'chargePerson',
                name: 'Sorumlu Bireyler',
                component: SorumluBireyler,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'company',
                name: 'Firmalar-Ekipler',
                component: CompanyTeam,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'reason',
                name: 'Öteleme Sebepleri',
                component: DelayReason,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'version',
                name: 'Hat Bilgisi',
                component: VersionInfo,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'meeting',
                name: 'Toplantı',
                component: Meeting,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'meetingTeam',
                name: 'Toplantı-Ekip',
                component: MeetingTeam,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'reportTeam',
                name: 'Rapor-Ekip',
                component: ReportTeam,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'zkp',
                name: 'ZKP3 Değişiklik',
                component: ZKP,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'excelMontage',
                name: 'Excel-Montaj',
                component: ExcelMontage,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: 'excelTree',
                name: 'Excel-Ürün Ağacı',
                component: ExcelTree,
                meta: {
                    public: false,
                    requiredPermissions: "A",
                }
            },
            {
                path: '/kisit',
                redirect: '/kisit/404',
                name: 'Kisit',
                component: {
                    render(c) { return c('router-view') }
                },
            }
            ]
        },
        {
            path: '/user',
            redirect: '/user/dashboardUser',
            name: 'Ana Sayfa',
            component: TheContainerUser,
            children: [{
                path: '/user/dashboardUser',
                name: 'Ana Sayfa',
                component: DashboardUser,
                meta: {
                    public: false,
                    requiredPermissions: "U",
                }
            },
            {
                path: '/user/kisit',
                name: 'Kısıt Giriş',
                component: Kisit,
                meta: {
                    public: false,
                    requiredPermissions: "U",
                }
            },
            {
                path: '/user/archiveConstraint',
                name: 'Arşivlenmiş Kısıtlar',
                component: ArchiveConstraint,
                meta: {
                    public: false,
                    requiredPermissions: "U",
                }
            },
            ]
        },

        {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) { return c('router-view') }
            },
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: Login,
                    meta: {
                        public: true,
                        onlyWhenLogout: true
                    }
                },

            ]
        }
    ]
}

router.beforeEach((to, from, next) => {
    const isPublic = to.matched.some(record => record.meta.public)
    const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLogout)
    const isUserOrAdmin = to.meta.requiredPermissions;
    const loggedIn = ServiceToken.getToken() !== null ? true : false;
    const userType = ServiceToken.getUserType();

    if (!isPublic && !loggedIn && userType === null) {
        return next({
            path: '/pages/login',
            query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
        });
    } else if (loggedIn && onlyWhenLoggedOut) {
        if (userType === "A") {
            return next('/dashboard')
        } else if (userType === "U") {
            return next('/user/dashboardUser')
        }

    } else if (isUserOrAdmin === userType || isUserOrAdmin === undefined)
        next();
    else {
        if (userType === "A") {
            return next('/dashboard')
        } else if (userType === "U") {
            return next('/user/dashboardUser')
        }

    }
})

export default router