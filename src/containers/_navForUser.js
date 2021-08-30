export default [{
    _name: 'CSidebarNav',
    _children: [
        {
            _name: 'CSidebarNavItem',
            name: 'Anasayfa',
            to: '/user/dashboardUser',
            icon: 'cil-speedometer',

        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Kısıt']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Kısıt Giriş',
            to: '/user/kisit',
            icon: 'cil-pencil',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Arşivlenmiş Kısıtlar',
            to: '/user/archiveConstraint',
            icon: 'cil-task',
        },
    ]
}]