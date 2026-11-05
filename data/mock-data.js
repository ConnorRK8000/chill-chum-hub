// Team Coco App - Mock Data

const mockVideos = [
    {
        id: '1',
        title: "Conan O'Brien Needs A Friend - Episode 412",
        description: "Conan interviews acclaimed actress and comedian Maya Rudolph about her career and new projects.",
        category: 'full-episodes',
        duration: '1:23:45',
        views: '245000',
        date: '2026-10-20',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.5\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3ECONAN%3C/text%3E%3C/svg%3E',
        platforms: [
            { name: 'YouTube', url: 'https://www.youtube.com/@TeamCoco', icon: 'youtube' },
            { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/conan-obrien-needs-a-friend/id1438054347', icon: 'podcast' },
            { name: 'Spotify', url: 'https://open.spotify.com/show/3u26tlz7A3WyWRtXliX9a9', icon: 'spotify' },
            { name: 'TeamCoco.com', url: 'https://teamcoco.com/', icon: 'web' }
        ]
    },
    {
        id: '2',
        title: "Conan Explains... The Metaverse",
        description: "A hilarious take on what the metaverse might actually be like.",
        category: 'clips',
        duration: '3:42',
        views: '892000',
        date: '2026-10-19',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.5\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3ECLIP%3C/text%3E%3C/svg%3E'
    },
    {
        id: '3',
        title: "Conan Goes Back to College",
        description: "Conan visits a college campus and causes chaos.",
        category: 'clips',
        duration: '5:18',
        views: '567000',
        date: '2026-10-18',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.5\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3ECLIP%3C/text%3E%3C/svg%3E'
    },
    {
        id: '4',
        title: "Team Coco Behind The Scenes: Season 5",
        description: "A look behind the curtain at how Conan O'Brien Needs A Friend is produced.",
        category: 'behind-scenes',
        duration: '12:30',
        views: '123000',
        date: '2026-10-17',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.2\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3EBTS%3C/text%3E%3C/svg%3E'
    },
    {
        id: '5',
        title: "Bill Hader Interview Highlights",
        description: "Best moments from Conan's conversation with Bill Hader.",
        category: 'interviews',
        duration: '8:22',
        views: '345000',
        date: '2026-10-16',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.2\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3EINT%3C/text%3E%3C/svg%3E'
    },
    {
        id: '6',
        title: "Conan O'Brien Needs A Friend - Episode 411",
        description: "Conan talks to legendary filmmaker and actor Robert De Niro.",
        category: 'full-episodes',
        duration: '1:18:30',
        views: '298000',
        date: '2026-10-15',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'6\' font-family=\'Arial\' font-size=\'1.5\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3ECONAN%3C/text%3E%3C/svg%3E'
    }
];

const mockTourDates = [
    {
        id: '1',
        date: '2026-11-05',
        day: '05',
        month: 'NOV',
        venue: 'The Fillmore',
        city: 'San Francisco, CA',
        ticketUrl: '#'
    },
    {
        id: '2',
        date: '2026-11-08',
        day: '08',
        month: 'NOV',
        venue: 'The Hollywood Palladium',
        city: 'Los Angeles, CA',
        ticketUrl: '#'
    },
    {
        id: '3',
        date: '2026-11-12',
        day: '12',
        month: 'NOV',
        venue: 'Radio City Music Hall',
        city: 'New York, NY',
        ticketUrl: '#'
    },
    {
        id: '4',
        date: '2026-11-15',
        day: '15',
        month: 'NOV',
        venue: 'The Chicago Theatre',
        city: 'Chicago, IL',
        ticketUrl: '#'
    },
    {
        id: '5',
        date: '2026-12-03',
        day: '03',
        month: 'DEC',
        venue: 'Ryman Auditorium',
        city: 'Nashville, TN',
        ticketUrl: '#'
    }
];

const mockMerch = [];

const mockPosts = [
    {
        id: '1',
        author: 'ConanFan87',
        avatar: 'CF',
        content: 'Just watched the Bill Hader episode - absolutely hilarious! The Metaverse bit had me in tears lol',
        time: '2 hours ago',
        likes: 24
    },
    {
        id: '2',
        author: 'PaleForceLover',
        avatar: 'PF',
        content: 'Who else misses the old Late Night era? Team Coco keeps getting better though!',
        time: '5 hours ago',
        likes: 18
    },
    {
        id: '3',
        author: 'NerdistNation',
        avatar: 'NN',
        content: 'Finally got tickets to the NYC show at Radio City! So pumped!',
        time: '1 day ago',
        likes: 32
    }
];

const mockFanArt = [
    {
        id: '1',
        title: 'Conan Portrait',
        author: 'ArtBySam',
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Crect fill=\'%23FF6B00\' width=\'200\' height=\'200\'/%3E%3Ccircle cx=\'100\' cy=\'90\' r=\'40\' fill=\'%23fdbcb4\'/%3E%3Crect x=\'70\' y=\'110\' width=\'60\' height=\'40\' rx=\'20\' fill=\'%23fdbcb4\'/%3E%3C/svg%3E'
    },
    {
        id: '2',
        title: 'Team Coco Logo Art',
        author: 'DesignGeek',
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Crect fill=\'%23000\' width=\'200\' height=\'200\'/%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'80\' fill=\'%23FF6B00\'/%3E%3Ctext x=\'100\' y=\'115\' font-family=\'Arial Black\' font-size=\'48\' fill=\'white\' text-anchor=\'middle\'%3ETC%3C/text%3E%3C/svg%3E'
    },
    {
        id: '3',
        title: 'Pale Force Comic',
        author: 'ComicFan123',
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Crect fill=\'%23fff\' width=\'200\' height=\'200\' stroke=\'%23000\' stroke-width=\'4\'/%3E%3Ctext x=\'100\' y=\'60\' font-family=\'Arial Black\' font-size=\'24\' text-anchor=\'middle\'%3EPALE FORCE%3C/text%3E%3Ccircle cx=\'100\' cy=\'110\' r=\'30\' fill=\'%23FF6B00\'/%3E%3C/svg%3E'
    }
];

const mockMeetups = [
    {
        id: '1',
        day: '02',
        month: 'NOV',
        name: 'LA Team Coco Meetup',
        location: 'The Grove, Los Angeles, CA'
    },
    {
        id: '2',
        day: '20',
        month: 'NOV',
        name: 'NYC Fan Hangout',
        location: 'Central Park, New York, NY'
    },
    {
        id: '3',
        day: '10',
        month: 'DEC',
        name: 'Chicago Conan Fans',
        location: 'Millennium Station, Chicago, IL'
    }
];

const mockTeam = [
    {
        id: '1',
        name: 'Conan O\'Brien',
        role: 'Host & Founder',
        bio: 'The one and only. The maestro, the Picasso of comedy. Late night legend, podcast host, and the reason we\'re all here.',
        image: 'icons/Conan .png'
    },
    {
        id: '2',
        name: 'Sona Movsesian',
        role: 'Executive Producer / Co-Host',
        bio: 'The World\'s Worst Assistant turned co-host of "Conan O\'Brien Needs A Friend". The GOAT.',
        image: 'icons/Sona.png'
    },
    {
        id: '3',
        name: 'Matt Gourley',
        role: 'Producer / Co-Host',
        bio: 'Actor, improviser, and co-host of "Conan O\'Brien Needs A Friend" (and a million other podcasts). The Bond of the podcast.',
        image: 'icons/Gourley.png'
    }
];

const mockSponsors = [
    {
        id: '1',
        name: "Hershey's",
        tagline: "Today's Sponsor",
        description: "Make every moment sweeter with Hershey's chocolate.",
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 120\'%3E%3Crect fill=\'%23C41E3A\' width=\'300\' height=\'120\'/%3E%3Ctext x=\'150\' y=\'70\' font-family=\'Arial Black\' font-size=\'36\' fill=\'white\' text-anchor=\'middle\'%3EHERSHEY\'S%3C/text%3E%3C/svg%3E',
        url: 'https://www.hersheys.com'
    },
    {
        id: '2',
        name: "HelloFresh",
        tagline: "Today's Sponsor",
        description: "Fresh ingredients, delicious recipes delivered to your door.",
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 120\'%3E%3Crect fill=\'%232ECC71\' width=\'300\' height=\'120\'/%3E%3Ctext x=\'150\' y=\'70\' font-family=\'Arial Black\' font-size=\'36\' fill=\'white\' text-anchor=\'middle\'%3EHelloFresh%3C/text%3E%3C/svg%3E',
        url: 'https://www.hellofresh.com'
    },
    {
        id: '3',
        name: "Squarespace",
        tagline: "Today's Sponsor",
        description: "Build your beautiful website with Squarespace.",
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 120\'%3E%3Crect fill=\'%23000\' width=\'300\' height=\'120\'/%3E%3Ctext x=\'150\' y=\'70\' font-family=\'Arial Black\' font-size=\'36\' fill=\'white\' text-anchor=\'middle\'%3ESQUARESPACE%3C/text%3E%3C/svg%3E',
        url: 'https://www.squarespace.com'
    }
];
