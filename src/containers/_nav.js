export default [{
    _name: 'CSidebarNav',
    _children: [
        {
            _name: 'CSidebarNavItem',
            name: 'Anasayfa',
            to: '/dashboard',
            icon: 'cil-speedometer',

        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Kısıt']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Kısıt Giriş',
            to: '/kisit',
            icon: 'cil-pencil',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'İşaretlenmemiş Kısıtlar',
            to: '/noMarkedConstraint',
            icon: 'cil-thumb-down',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'İşaretlenmiş Kısıtlar',
            to: '/markedConstraint',
            icon: 'cil-thumb-up',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Arşivlenmiş Kısıtlar',
            to: '/archiveConstraint',
            icon: 'cil-task',
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Toplantı']
        },

        {
            _name: 'CSidebarNavItem',
            name: 'Toplantı-Firma',
            to: '/meeting',
            icon: 'cil-library',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'ZKP3 Değişiklik',
            to: '/zkp',
            icon: 'cil-task',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Toplantı-Ekip',
            to: '/meetingTeam',
            icon: 'cil-library',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Rapor-Ekip',
            to: '/reportTeam',
            icon: 'cil-task',
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Öteleme Geçmişleri']
        },

        {
            _name: 'CSidebarNavItem',
            name: 'Öteleme Geçmişleri',
            to: '/delayHistory',
            icon: 'cil-file',
        },
       
        /*{
            _name: 'CSidebarNavTitle',
            _children: ['']
        },
       
        
        {
            _name: 'CSidebarNavDropdown',
            name: 'Listeleme',
            route: '/kisit',
            icon: 'cil-cursor',
            items: [ {
               
                name: 'Montaj-Üretim Planı',
                to: '/montage',
                icon: 'cil-list',
            },
            {
               
                name: 'Ürün Ağacı',
                to: '/tree',
                icon: 'cil-list',
            },
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'Güncelleme',
            route: '/kisit',
            icon: 'cilPuzzle',
            items: [{
                    name: 'Sorumlu Bireyler',
                    to: '/chargePerson',
                    icon: 'cil-people',
                },
                {
                    name: 'Firmalar-Ekipler',
                    to: '/company',
                    icon: 'cil-bank',
                },
                {
                    name: 'Öteleme Sebepleri',
                    to: '/reason',
                    icon: 'cil-library',
                },
                {
                    name: 'Hat Bilgisi',
                    to: '/version',
                    icon: 'cil-chart-line',
                }
            ]
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'Yükleme',
            route: '/kisit',
            icon: 'cil-basket',
            items: [{
                name: 'Ürün Ağacı-Excel',
                to: '/excelTree',
                icon: 'cil-cloud-upload',
                },
                {
                    name: 'Montaj Üretim Planı-Excel',
            to: '/excelMontage',
            icon: 'cil-cloud-upload',
                },
            ]
        },*/

        {
            _name: 'CSidebarNavTitle',
            _children: ['Listeleme']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Montaj-Üretim Planı',
            to: '/montage',
            icon: 'cil-list',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Ürün Ağacı',
            to: '/tree',
            icon: 'cil-list',
        },

        {
            _name: 'CSidebarNavTitle',
            _children: ['Bilgiler']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Sorumlu Bireyler',
            to: '/chargePerson',
            icon: 'cil-people',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Firmalar-Ekipler',
            to: '/company',
            icon: 'cil-bank',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Öteleme Sebepleri',
            to: '/reason',
            icon: 'cil-library',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Hat Bilgisi',
            to: '/version',
            icon: 'cil-chart-line',
        },

        {
            _name: 'CSidebarNavTitle',
            _children: ['Hesap']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Hesap Ekle',
            to: '/register',
            icon: 'cil-user',
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Kullanıcılar',
            to: '/users',
            icon: 'cil-people',
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Yükleme']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Montaj Üretim Planı-Excel',
            to: '/excelMontage',
            icon: 'cil-cloud-upload',
        }, {
            _name: 'CSidebarNavItem',
            name: 'Ürün Ağacı-Excel',
            to: '/excelTree',
            icon: 'cil-cloud-upload',
        },



    ]
}]