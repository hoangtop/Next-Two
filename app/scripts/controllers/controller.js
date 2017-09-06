angular
    .module('vietteltv')
    .controller('Controller', Controller);

Controller.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$document', 'FocusUtil', 'FocusConstant', 'focusController', 'CONSTANT', 'DataService', '$http', 'UltilService', 'VideoService', 'Principal', 'LoginService', 'Auth', 'toaster', '$interval', 'localStorageService'];
/**
 * Controller
 * @author HoangCH
 * 
 * @param {any} $rootScope 
 * @param {any} $scope 
 * @param {any} $state 
 * @param {any} $timeout 
 * @param {any} $document 
 * @param {any} FocusUtil 
 * @param {any} FocusConstant 
 * @param {any} focusController 
 * @param {any} CONSTANT 
 * @param {any} DataService 
 * @param {any} $http 
 * @param {any} UltilService 
 * @param {any} VideoService 
 * @param {any} Principal 
 * @param {any} LoginService 
 * @param {any} Auth 
 * @param {any} toaster 
 */
function Controller($rootScope, $scope, $state, $timeout, $document, FocusUtil, FocusConstant, focusController, CONSTANT, DataService, $http, UltilService, VideoService, Principal, LoginService, Auth, toaster, $interval, localStorageService) {

    /*function declaration*/
    $scope.onScrollFinish = onScrollFinish;

    $scope.onVodFocused = onVodFocused;
    $scope.onScrollStart = onScrollStart;
    $scope.onRelatedVodFocused = onRelatedVodFocused;
    $scope.onCategoryVodFocused = onCategoryVodFocused;
    $scope.onEpisodeVodFocused = onEpisodeVodFocused;
    $scope.onCategoryMenuFocused = onCategoryMenuFocused;
    $scope.onCategoryMenuSelected = onCategoryMenuSelected;
    $scope.onChannelFocused = onChannelFocused;
    $scope.onVodBlurred = onVodBlurred;
    $scope.onSidebarCategoryFocused = onSidebarCategoryFocused;
    $scope.onChannelSelected = onChannelSelected;
    $scope.onChannelBlurred = onChannelBlurred;
    $scope.onVodSelected = onVodSelected;
    $scope.onCategoryVodSelected = onCategoryVodSelected;
    $scope.onRelatedVodSelected = onRelatedVodSelected;
    $scope.onEpisodeVodSelected = onEpisodeVodSelected;
    $scope.onBtnVodPlayFocusInDetail = onBtnVodPlayFocusInDetail;
    $scope.onBtnVodEpisodeFocusInDetail = onBtnVodEpisodeFocusInDetail;
    $scope.onBtnVodRelatedFocusInDetail = onBtnVodRelatedFocusInDetail;
    $scope.onBtnViewSpotlightFocused = onBtnViewSpotlightFocused;
    $scope.onBtnVodPlaySelected = onBtnVodPlaySelected;
    $scope.onBtnViewSpotlightSelected = onBtnViewSpotlightSelected;
    $scope.onLoginCancelButtonSelected = onLoginCancelButtonSelected;
    $scope.onLoginButtonSelected = onLoginButtonSelected;
    $scope.setMediaControllerTimer = setMediaControllerTimer;
    $scope.back = back;
    $scope.getCurrentChannelProgram = getCurrentChannelProgram;
    $scope.onQuickChannelSelected = onQuickChannelSelected;
    $scope.onQuickChannelFocused = onQuickChannelFocused;
    $scope.mediaPause = mediaPause;
    $scope.mediaForward = mediaForward;
    $scope.mediaRewind = mediaRewind;
    $scope.mediaNext = mediaNext;
    $scope.mediaRestart = mediaRestart;
    $scope.mediaTogglePlay = mediaTogglePlay;
    $scope.mediaSeeked = mediaSeeked;
    $scope.mediaSeeking = mediaSeeking;
    $scope.mediaEnded = mediaEnded;
    $scope.onPlayerPointerSelect = onPlayerPointerSelect;

    /* CONSTANT values definition */
    $scope.CATEGORY = CONSTANT.CATEGORY;
    $scope.DEPTH = {
        INDEX: 1,
        DETAIL: 2,
        CATEGORY: 3,
        PLAYER: 4,
        LOGIN: 5,
        DIALOG: 6,
        WARNING: 7,
        ALERT: 8
    };
    $scope.DEPTH_ZONE = {
        INDEX: {
            SPOTLIGHT: 1,
            CHANNEL: 2,
            CATEGORY: 3,
        },
        DETAIL: {
            SPOTLIGHT: 4,
            CHANNEL: 5,
            CATEGORY: 6,
        },
        CATEGORY: {
            VOD: 7,
            CHANNEL: 8
        }
    };

    /* Initial values are defined.*/
    $scope.currentCategory = CONSTANT.CATEGORY.COLORS;
    $scope.currentDepth = $scope.DEPTH.INDEX;
    $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
    var currentCategoryInHome;
    $scope.isOverviewDark = true;
    $scope.showMediaController = false;
    $scope.lastDepth = $scope.currentDepth;
    var lastDepthZone = $scope.currentDepthZone;
    var items = CONSTANT.ITEMS;
    var fakeItem = CONSTANT.ITEM;
    $scope.dataCategory = [items, items, items, items, items, items, items, items, items, items, items];
    $scope.relatedPlaylist = items;
    $scope.episodePlaylist = items;
    var vodListByCategoryDefault = [fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem];;
    $scope.vodListByCategory = [];
    $scope.isVodCategoryOpened = false;
    $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
    $scope.bgGradient1 = CONSTANT.SPOTLIGHT_BG_GRADIENT1;
    $scope.bgGradient2 = CONSTANT.SPOTLIGHT_BG_GRADIENT2;
    $scope.bgSize = CONSTANT.SPOTLIGHT_BG_SIZE;
    $scope.isAuthenticated = Principal.isAuthenticated;

    $timeout(function () { //display spotlight background image
        $scope.bgImgCoverOpacity = 0;
        $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
    }, 400);

    $scope.login = {
        username: '',
        password: ''
        // password: 'qaz123'
    };

    $scope.CATEGORY_MENU = CONSTANT.PREPARED_DATA.CATEGORY_MENUS;
    var hls;
    var video;
    $scope.menuArray = [];
    $scope.headerMenus = [];
    $scope.homeCategoryNameList = [];
    $scope.homeCategoryDataMap = {};
    $scope.isMediaLoaderHidden = true;
    $scope.isMainLoaderShown = false;
    $scope.selectedSidebarCategory = null;
    var currentSpotlight = null;
    var allChannelList = null;
    var noCategoryInHome = 0;
    var isOnline = true;
    var isChannelListLoaded = false;
    var isVodListLoaded = false;
    var isSeriesVodLoaded = false;
    main();

    function main() {
        setInternetConnectionTimer();
        processKeydownEvent();

        $timeout(function () {
            DataService.getChannelList().then(function success(channelList) {
                console.log("channelList:", channelList);
                allChannelList = channelList;
                $scope.allChannelList = channelList;
                updateCategoryListData(channelList, 0, true);
                isChannelListLoaded = true;
                if (isChannelListLoaded && isVodListLoaded && isSeriesVodLoaded && isGotSpotlight) {
                    // processSpotlightVodList();
                    onInitCompleted();
                }
            }, function error(response) {
                console.error('Loi trong qua trinh goi getChannelList!');
                console.error(response);
            });
            DataService.getMenuCategories().then(function (menus) {
                $scope.menuArray = menus;
                noCategoryInHome = menus[0].children.length;
                var homeCategoryNameList = [];
                for (var index = 1; index < menus[0].children.length; index++) {
                    var menuItem = menus[0].children[index];
                    homeCategoryNameList.push({
                        'index': index,
                        'name': menuItem.this.name[0].text
                    });
                }

                $scope.homeCategoryNameList = homeCategoryNameList;
                for (var index = 1; index < menus[0].children.length; index++) {
                    var menuItem = menus[0].children[index];
                    if (UltilService.isSeriesCategory(menuItem)) {
                        processSeriesVODList(index, menuItem, UltilService.getVodCategoryId(menuItem));
                    } else {
                        processVODList(menuItem, index);
                    }
                }
                $scope.focusedMenu = menus[0];
            }, function () {
                console.error('menus retrieval failed.');
            });
            processSpotlightVodList();
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    var lastOnlineStatus = true;


    function onPlayerPointerSelect() {
        console.log("onPlayerPointerSelect: ....");
    }

    function setInternetConnectionTimer() {
        setInterval(function () {
            isOnline = navigator.onLine;
            if (!isOnline) {
                lastOnlineStatus = false;
                showNetworkDisconnectedWarning();
            } else {
                if (!lastOnlineStatus) {
                    // $scope.dialog.show = false;
                    lastOnlineStatus = true;
                    $timeout(function () {
                        $scope.warning.show = false;
                    }, 300);
                }
            }

        }, 1500);
    }

    var isGotSpotlight = false;

    function processSpotlightVodList() {
        if (isGotSpotlight) return;

        DataService.getSpotlightContents().then(function success(spotlightVodList) {
            console.log("getSpotlightContents:", spotlightVodList);
            var intervalIndex = 0;
            $scope.spotlightVodList = spotlightVodList;
            // console.log('spotlightVodList:', spotlightVodList);
            spotlightVodList[0].isSpotlight = true;
            currentSpotlight = spotlightVodList[0];
            // console.log('intervalIndex:', 0);
            setSpotlightPackground(spotlightVodList[0].bigPhotoUrl);
            $scope.spotlightOverview = spotlightVodList[0];
            $scope.lastOverview = $scope.spotlightOverview;

            intervalIndex++;
            var firstRound = $interval(function () {
                if ($scope.currentDepthZone === $scope.DEPTH_ZONE.INDEX.SPOTLIGHT) {
                    $timeout(function () { // Set 'focus' to specific element by 'focus' controller.
                        spotlightVodList[intervalIndex].isSpotlight = true;
                        currentSpotlight = spotlightVodList[intervalIndex];
                        setSpotlightPackground(spotlightVodList[intervalIndex].bigPhotoUrl);
                        $scope.spotlightOverview = spotlightVodList[intervalIndex];
                        $scope.lastOverview = $scope.spotlightOverview;

                        if (intervalIndex < spotlightVodList.length - 1) {
                            intervalIndex++;
                        } else {

                            $interval.cancel(firstRound);
                            intervalIndex = 0;
                            $interval(function () {
                                if ($scope.currentDepthZone === $scope.DEPTH_ZONE.INDEX.SPOTLIGHT) {
                                    // spotlightVodList[intervalIndex].photoUrl = CONSTANT.SPOTLIGHT_VOD_LIST[intervalIndex].img;
                                    $timeout(function () { // Set 'focus' to specific element by 'focus' controller.
                                        spotlightVodList[intervalIndex].isSpotlight = true;
                                        currentSpotlight = spotlightVodList[intervalIndex];
                                        // console.log('intervalIndex:', intervalIndex);
                                        setSpotlightPackground(spotlightVodList[intervalIndex].bigPhotoUrl);
                                        $scope.spotlightOverview = spotlightVodList[intervalIndex];
                                        $scope.lastOverview = $scope.spotlightOverview;

                                        if (intervalIndex < spotlightVodList.length - 1) {
                                            intervalIndex++;
                                        } else {

                                            $interval.cancel(firstRound);
                                            intervalIndex = 0;


                                        }
                                    }, 400);
                                }


                            }, 15000);

                        }
                    }, 0);
                }


            }, 100);


            focusController.focus('btnView');
            isGotSpotlight = true;
            if (isChannelListLoaded && isVodListLoaded && isSeriesVodLoaded && isGotSpotlight) {
                // processSpotlightVodList();
                onInitCompleted();
            }
        }, function error() { });

    }

    /**
     * processVODList
     * @author HoangCH
     * @param {any} menuItem 
     * @param {any} index 
     */
    function processVODList(menuItem, index) {
        DataService.getVodListByCategoryId(UltilService.getVodCategoryId(menuItem)).then(function success(response) {
            var vodList = response;
            if (vodList) {
                updateCategoryListData(vodList, index, true);
                isVodListLoaded = true;
                if (isChannelListLoaded && isVodListLoaded && isSeriesVodLoaded && isGotSpotlight) {
                    // processSpotlightVodList();
                    onInitCompleted();
                }
            }
        }, function error(response) {
            console.error('Loi trong qua trinh goi getVodListByCategoryId!');
            console.error(response);
            setTimeout(function () {
                console.info('Reload when Connection Reset By Peer ...............................! ');
                // $state.reload();
                processVODList(menuItem, index);
            }, 200);
        });
    }

    function onInitCompleted() {
        setTimeout(function () {
            $scope.isInitCompleted = true; // 'Welcome' page will be disappear by this line.

            setMenuFocusedPackground();
            if ($scope.dataCategory[1][0]) {
                setVodDetailPackground($scope.dataCategory[1][0].bigPhotoUrl);
            }
        }, 1000);

        // setSpotlightPackground();
    }

    function processSeriesVODList(index, menuItem, categoryId) {
        DataService.getSeriesVodList(categoryId, 16).then(function success(response) {
            var seriesVodList = response;
            if (seriesVodList) {
                updateCategoryListData(seriesVodList, index, true);
                isSeriesVodLoaded = true;
                if (isChannelListLoaded && isVodListLoaded && isSeriesVodLoaded && isGotSpotlight) {
                    // processSpotlightVodList();
                    onInitCompleted();
                }
            }
        }, function error(response) {
            console.error('Loi trong qua trinh goi VodService.getSeriesVodList! Response = ');
            console.error(response);
            setTimeout(function () {
                console.info('Reload when Connection Reset By Peer ...............................! ');
                // $state.reload();
                processSeriesVODList(index, menuItem, categoryId);
            }, 200);
        });
    }
    var lastFocusedGroup;
    var categoryMenuFocusedGroup;
    var lastCategoryVodFocusedGroup;
    var lastCategoryChannelFocusedGroup;
    var lastHomeChannelFocusedGroup;
    var detailPlayFocusedGroup;
    var currentItemData;
    var isScrolling = false;

    function onScrollStart() {
        isScrolling = true;
    };

    function onScrollFinish() {
        isScrolling = false;
        updateOverview();
    }



    // The callback function which is called when each list component get the 'focus'.
    function onVodFocused($event, category, data, $index) {
        console.log('11111111111111111111111111111111 focused...');
        currentCategoryInHome = category;
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.episodePlaylist = [];
            $scope.currentDetailRelatedList = null;
            $scope.currentDetailEpisodeList = null;
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CATEGORY;
            var scrollCount = category;
            // Translate each list component to up or down.
            moveContainer(category, 'list-category', -CONSTANT.SCROLL_HEIGHT_OF_INDEX * scrollCount + 160);
            removeFadeoutUpClassToCurrentSlider();
            addFadeoutUpClassToPrevSlider();

            $scope.isForceSpotlightHide = true;
            $scope.isForceChannelInfoShown = false;

            if (!data || !data || data.loaded === false) {
                return;
            }

            currentItemData = data;
            if (typeof $scope.currentDetailOverview === 'undefined' || $scope.currentDetailOverview === null || (typeof $scope.currentDetailOverview !== 'undefined' && data.program.id !== $scope.currentDetailOverview.program.id)) { //not update UI when focus after return back from detail page
                console.log("comong ....");
                $scope.isVodShown = true;
                $scope.isVodMaskSlow = false;
                setVodDetailPackground(currentItemData.bigPhotoUrl);
                $scope.isSpotlightShown = false;
            }

            $scope.currentDetailOverview = null; //reset 
            isScrolling === false && updateOverview();
            $scope.currentOverview = $scope.overview;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function onRelatedVodFocused($event, category, data, $index) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        currentItemData = data;
        setVodDetailPackground(currentItemData.bigPhotoUrl);
        $scope.isSpotlightShown = false;
        $scope.isVodShown = true;

        isScrolling === false && updateOverview();
    }

    function onCategoryVodFocused($event, data, element, $index) {
        if (!data || !data || data.loaded === false) {
            return;
        }

        $scope.isVodCategoryOpened = true;
        $scope.isForceChannelInfoShown = false;
        currentItemData = data;

        if (!currentItemData.isChannel) {
            $scope.currentDepthZone = $scope.DEPTH_ZONE.CATEGORY.VOD;
        }

        if (currentItemData.isChannel) {
            $scope.channelOverview = currentItemData;
        } else {
            $scope.overview = currentItemData;

        }

        var vodList = $scope.selectedSidebarCategory.vodListByCategory;
        var showElements = $('.category-vod-item:not(.item-fadeout)');
        var hideElements = $('.category-vod-item.item-fadeout');
        var isItemInView = false;
        var isItemBeforeView = false;
        var isItemAfterView = false;
        var isLoadMoreItems = false;
        var noItemPerRow = 8;
        var itemHeight;
        var noItemInView = 2;
        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
            noItemPerRow = 8;
            itemHeight = 307;
            noItemInView = 2;
        } else {
            noItemPerRow = 5;
            itemHeight = 177;
            noItemInView = 3;
        }
        var currentRowCount = Math.floor($index / noItemPerRow);
        for (var index = 0; index < noItemPerRow * noItemInView; index++) {
            if (showElements[index]) {
                if (showElements[index].id === 'category-vod-item-' + $index) {
                    isItemInView = true;
                }
            }
        }
        for (var index = 0; index < hideElements.length; index++) {
            if (hideElements[index].id === 'category-vod-item-' + $index) {
                isItemBeforeView = true;
            }
        }

        if (!isItemInView && !isItemBeforeView) {
            isItemAfterView = true;
        }

        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
            if ((vodList.length - $index <= noItemPerRow && vodList.length - $index > 0) && isItemAfterView) {
                isLoadMoreItems = true;
            }
        }

        if (isLoadMoreItems) { //current focused item in the second row fro bottom then load more items
            getMoreVodsInCategory(function () {
                if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
                    moveCategoryVodContainer(-(currentRowCount - 1) * itemHeight - 5);
                } else {
                    moveCategoryVodContainer(-(currentRowCount - 2) * (itemHeight + 7));
                }
                for (var index = 0; index < noItemPerRow; index++) {
                    var ele = showElements[index];
                    $(ele).addClass('item-fadeout');
                }
            });
        } else if (isItemAfterView && !isLoadMoreItems) { //move down without load more items
            if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
                moveCategoryVodContainer(-(currentRowCount - 1) * itemHeight - 5);
            } else {
                moveCategoryVodContainer(-(currentRowCount - 2) * (itemHeight + 7));
            }
            for (var index = 0; index < noItemPerRow; index++) {
                var ele = showElements[index];
                $(ele).addClass('item-fadeout');
            }
        } else if (isItemBeforeView) { //move up
            moveCategoryVodContainer(-currentRowCount * (itemHeight + 7));
            for (var index = $index - $index % noItemPerRow; index < $index - $index % noItemPerRow + noItemPerRow; index++) {
                var ele = $('#category-vod-item-' + index);
                ele.removeClass('item-fadeout');
            }
        }


        $scope.isMenuShown = true;
        $scope.isVodShown = false;
        // $scope.isVodMaskSlow = true;
        setMenuFocusedPackground('images/menu_bg_focused_' + $scope.selectedCategoryMenuIndex + '.jpg');

        $scope.currentOverview = currentItemData;
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;


        if (currentItemData.isChannel) {
            lastCategoryChannelFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        } else {
            lastCategoryVodFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }

    }

    function updateEpisodesOfSeries(episodeVodList, $event) {
        currentItemData = episodeVodList[0];
        $scope.episodePlaylist = episodeVodList;
        $scope.currentDetailEpisodeList = episodeVodList;
        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        $timeout(function () { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = currentItemData.photoUrl;
        }, 400);
        isScrolling === false && updateOverview();
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function onEpisodeVodFocused($event, category, data, $index) {
        if (!data || !data.item || data.item.loaded === false) {
            return;
        }

        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        currentItemData = data.item;
        $timeout(function () { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = currentItemData.photoUrl;
        }, 400);
        isScrolling === false && updateOverview();
    }

    function onCategoryMenuFocused($event, category, data, $index) {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CATEGORY;
            // Translate each list component to up or down.
            moveToCategoryMenu();
            if (!data || !data.item || data.item.loaded === false) {
                return;
            }
            currentItemData = data.item;
            $scope.focusedMenu = currentItemData;
            $scope.sidebarCategories = data.item.children;
            console.log('sidebarCategories:', $scope.sidebarCategories);
            setMenuFocusedPackground('images/menu_bg_focused_' + $index + '.jpg');
            $scope.isSpotlightShown = false;
            $scope.isVodShown = false;
            $scope.isMenuShown = true;
            $scope.isForceSpotlightHide = false;
            $scope.isVodMaskSlow = true;

            lastCategoryVodFocusedGroup = ''; //reset category vod focus
            lastCategoryChannelFocusedGroup = '';
            // isScrolling === false && updateOverview();
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            categoryMenuFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function onChannelFocused($event, category, data, $index) {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CHANNEL;
            var scrollCount = category;

            removeFadeoutUpClassToCurrentSlider();

            $scope.isForceSpotlightHide = true;
            $scope.isSpotlightShown = false;
            $scope.isChannelHeaderShown = true;
            $scope.isForceChannelInfoShown = true;

            moveContainer(category, 'list-category', -72);

            if (!data || !data.item || data.item.loaded === false) {
                return;
            }

            currentItemData = data.item;

            DataService.getChannelGuide(currentItemData).then(function success(channelItem) {
                processSelectedChannelNow(channelItem);
                $scope.currentOverview = $scope.channelOverview;
                $scope.spotlightOverview = null;
                $scope.overview = null;
            }, function error(response) {
                console.error('Loi trong qua trinh goi VodService.getSeriesVodList! Response = ');
                console.error(response);

            });

            lastHomeChannelFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            $scope.isVodMaskSlow = true;
            setSpotlightPackground();

        }
    }

    var lastFocusedItem;

    function onQuickChannelFocused($event, category, data, $index) {
        $timeout(function () { // Set 'focus' to specific element by 'focus' controller.

            var channelItem = data;
            var focusedItem = $("#channel-quick-list-item-" + channelItem.channelId);
            var quickListView = $(".channel-quick-list");

            var itemTopHeight = focusedItem.position().top + focusedItem[0].offsetHeight;
            var viewTopHeight = quickListView.position().top + quickListView[0].offsetHeight;
            var viewPaddingTop = (quickListView.outerHeight() - quickListView.innerHeight()) / 2;
            var isItemInView = focusedItem.position().top >= viewPaddingTop + 30 && itemTopHeight <= viewTopHeight - 30;
            var isItemAboveView = focusedItem.position().top < viewPaddingTop;
            var isItemBelowView = itemTopHeight > viewTopHeight;

            console.log('focusedItem.position().top  ....', focusedItem.position().top);
            console.log('focusedItem[0].offsetHeight  ....', focusedItem[0].offsetHeight);
            console.log('itemTopHeight ....', itemTopHeight);
            console.log('viewTopHeight ....', viewTopHeight);
            console.log('viewPaddingTop ....', viewPaddingTop);
            console.log('isItemInView ....', isItemInView);
            console.log('isItemAboveView ....', isItemAboveView);
            console.log('isItemBelowView ....', isItemBelowView);


            // if (isItemAboveView) {
            //     console.log('above ....');
            //     // quickListView.animate({ scrollTop: focusedItem.offset().top - quickListView.height() / 2 }, 1000, 'linear');
            //     quickListView.animate({ scrollTop: quickListView[0].scrollTop - 4 * focusedItem[0].offsetHeight }, 700, 'linear');
            // } else if (isItemBelowView) {
            //     console.log('below ....');
            //     quickListView.animate({ scrollTop: quickListView[0].scrollTop + 4 * focusedItem[0].offsetHeight + (focusedItem[0].offsetTop - quickListView[0].offsetTop - quickListView[0].offsetHeight) }, 700, 'linear');
            // }

            if (lastFocusedItem) {

                function scrollQuickListView1() {
                    quickListView.animate({ scrollTop: quickListView[0].scrollTop - 2 * focusedItem[0].offsetHeight - (lastFocusedItem[0].offsetTop - focusedItem[0].offsetTop) }, 500, 'linear', function () {
                        $timeout(function () {
                            itemTopHeight = focusedItem.position().top + focusedItem[0].offsetHeight;
                            viewTopHeight = quickListView.position().top + quickListView[0].offsetHeight;
                            viewPaddingTop = (quickListView.outerHeight() - quickListView.innerHeight()) / 2;
                            isItemInView = focusedItem.position().top >= viewPaddingTop && itemTopHeight <= viewTopHeight;
                            if ((focusedItem[0].offsetTop < lastFocusedItem[0].offsetTop) && !isItemInView) {
                                scrollQuickListView1();
                            }
                        }, 200)
                    });
                }

                function scrollQuickListView2() {
                    quickListView.animate({ scrollTop: quickListView[0].scrollTop + 2 * focusedItem[0].offsetHeight + (focusedItem[0].offsetTop - lastFocusedItem[0].offsetTop) }, 500, 'linear', function () {
                        $timeout(function () {
                            itemTopHeight = focusedItem.position().top + focusedItem[0].offsetHeight;
                            viewTopHeight = quickListView.position().top + quickListView[0].offsetHeight;
                            viewPaddingTop = (quickListView.outerHeight() - quickListView.innerHeight()) / 2;
                            isItemInView = focusedItem.position().top >= viewPaddingTop && itemTopHeight <= viewTopHeight;
                            if (focusedItem[0].offsetTop > lastFocusedItem[0].offsetTop && !isItemInView) {
                                scrollQuickListView2();
                            }
                        }, 200)
                    });
                }
                if ((focusedItem[0].offsetTop < lastFocusedItem[0].offsetTop) && !isItemInView) {
                    console.log('up ....', focusedItem[0].offsetTop < lastFocusedItem[0].offsetTop, focusedItem[0].offsetTop, lastFocusedItem[0].offsetTop);
                    scrollQuickListView1();
                } else if (focusedItem[0].offsetTop > lastFocusedItem[0].offsetTop && !isItemInView) {
                    console.log('down ....', focusedItem[0].offsetTop > lastFocusedItem[0].offsetTop, focusedItem[0].offsetTop, lastFocusedItem[0].offsetTop);
                    scrollQuickListView2();
                }
            } else {
                if (isItemBelowView) {
                    console.log('below .... at first time2');
                    quickListView.animate({ scrollTop: quickListView[0].scrollTop + 4 * focusedItem[0].offsetHeight + (focusedItem[0].offsetTop - quickListView[0].offsetTop - quickListView[0].offsetHeight) }, 500, 'linear');
                }


            }

            lastFocusedItem = focusedItem;
        }, 300);


    }

    function processChannelListNow(allChannelList) {
        angular.forEach(allChannelList, function (channelItem, key) {
            var program;
            angular.forEach(channelItem.guides, function (guide, key) {
                if (guide.is_playing === "now") {
                    // console.log('get currentProgram.............................................!!!!!!!!!!!!!!!!!!! now', guide.program1);
                    var now = new Date();
                    var passed = now.getTime() - guide.startTime.getTime();
                    guide.passedDuration = passed;
                    channelItem.playingProgram = guide;
                    program = guide;
                }
            });

            if (channelItem.channelId === $scope.channelOverview.channelId) {
                $scope.channelOverview.playingProgram = program;
            }


        });
    }


    function processSelectedChannelNow(channelItem) {

        angular.forEach(channelItem.guides, function (guide, key) {
            if (guide.is_playing === "now") {
                var now = new Date();
                var passed = now.getTime() - guide.startTime.getTime();
                guide.passedDuration = passed;
                channelItem.playingProgram = guide;
                $scope.channelOverview = channelItem;
            }
        });

    }

    function getCurrentChannelProgram(channelItem) {
        var program;
        if (channelItem && channelItem.guides) {
            angular.forEach(channelItem.guides, function (guide, key) {
                if (guide.is_playing === "now") {
                    var now = new Date();
                    var passed = now.getTime() - program.startTime.getTime();

                    program = guide;
                    program.passedDuration = passed;
                }
            });
            return program;
        } else {
            return null;
        }

    }


    function getPassedDurationChannel(program) {
        var now = new Date();
        var passed = now.getTime() - program.startTime.getTime();
        return passed;
    }
    // The callback function which is called when each list component lose the 'focus'.
    function onVodBlurred($event, category, data) {
        // console.log("The callback function which is called when each list component lose the 'focus'");
        // $scope.isOverviewDark = true;
    }


    var isLoadNewCategory = false;

    function onCategoryMenuSelected($event, category, data, $index) {
        isLoadNewCategory = true;
        if (!data || !data.item || data.item.loaded === false) {
            console.log('item not loaded ++++++++++++++++++++ ');
            return;
        }
        if ($index === 0) { // Homepage
            moveToSpotlightDown();
            focusController.focus('btnView');
        } else if ($index === 1) {
            $scope.overview = null;
            $scope.sidebarCategories = CONSTANT.CHANNEL_CATEGORY_LIST;
            $scope.selectedCategoryMenu = data.item.this.name[0].text;
            $scope.selectedCategoryMenuIndex = $index;
            $scope.vodListByCategory = [];
            $scope.isMainLoaderShown = true;
            changeDepth($scope.DEPTH.CATEGORY, function () {
                // focusController.focus('sidebar-category-item-0');
                $timeout(function () {
                    focusController.focus(document.getElementById('sidebar-category-item-0'));
                }, 100);
            });
            $scope.currentDepthZone = $scope.DEPTH_ZONE.CATEGORY.CHANNEL;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        } else {
            $scope.overview = null;
            $scope.sidebarCategories = data.item.children;
            $scope.selectedCategoryMenu = data.item.this.name[0].text;
            $scope.selectedCategoryMenuIndex = $index;
            $scope.vodListByCategory = [];
            $scope.isMainLoaderShown = true;

            console.log("focusController", focusController);
            changeDepth($scope.DEPTH.CATEGORY, function () {
                focusController.focus(document.getElementById('sidebar-category-item-0'));

            });
            $scope.currentDepthZone = $scope.DEPTH_ZONE.CATEGORY.VOD;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function setCategoryPagePackground() {
        $scope.bgGradient1 = CONSTANT.CATEGORY_PAGE_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_PAGE_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_PAGE_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function () {
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = CONSTANT.CATEGORY_PAGE_BG_IMG_URL;
        }, 400);
    }

    function setSpotlightPackground(bgrUrl, callback) {

        $scope.bgGradient1 = CONSTANT.SPOTLIGHT_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.SPOTLIGHT_BG_GRADIENT2;
        $scope.bgSpotlightSize = CONSTANT.SPOTLIGHT_BG_SIZE;
        $scope.bgSpotlightWidth = CONSTANT.SPOTLIGHT_BG_WIDTH;

        $scope.isVodShown = false;
        $scope.isMenuShown = false;
        $scope.isSpotlightShown = true;

        $scope.bgImgCoverOpacity = 0;
        if (bgrUrl) {
            $scope.bgSpotlightImgUrl = bgrUrl;
        } else {
            // $scope.bgSpotlightImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
        }
        callback && callback();
        // }, CONSTANT.EFFECT_DELAY_TIME);
    }

    function moveToSpotlightDown() {
        $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
        // setSpotlightPackground(currentSpotlight.bigPhotoUrl, function() {
        //     // focusController.focus('btnView');
        // });
        $('.menu-container ').css({
            transform: 'translate3d(0,-1080px,0)'
        });
        $('.overview-container ').css({
            transform: 'translate3d(0,0px,0)'
        });
        $('.list-category').css({
            transform: 'translate3d(0,0px,0)'
        });
    }

    function moveToCategoryMenu() {
        $('.menu-container ').css({
            transform: 'translate3d(0,0px,0)'
        });
        $('.overview-container ').css({
            transform: 'translate3d(0,1080px,0)'
        });
        $('.list-category').css({
            transform: 'translate3d(0,1080px,0)'
        });
    }

    function setCategoryVodFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_VOD_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_VOD_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_VOD_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function () {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.CATEGORY_VOD_BG_IMG_URL;
            }
        }, 400);
    }

    function setCategoryChannelFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function () {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_IMG_URL;
            }
        }, 400);
    }

    function setVodDetailPackground(bgrUrl) {
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgUrl = bgrUrl;
        $scope.bgGradient1 = CONSTANT.VOD_DETAIL_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.VOD_DETAIL_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.VOD_DETAIL_BG_SIZE;
        $scope.bgWidth = CONSTANT.VOD_DETAIL_BG_WIDTH;
        // $scope.bgImgCoverOpacity = 1;
        // $scope.bgImgCoverWidth = '100%';
        $timeout(function () {
            $scope.bgImgCoverOpacity = 0;

        }, 400);

    }

    function setMenuFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.MENU_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.MENU_BG_GRADIENT2;
        $scope.bgMenuSize = CONSTANT.MENU_BG_SIZE;
        $scope.bgMenuWidth = CONSTANT.MENU_BG_WIDTH;
        // $scope.bgImgCoverOpacity = 1;
        // $scope.bgImgCoverWidth = '100%';
        console.log('setMenuFocusedPackground ...', bgrUrl);
        if (bgrUrl) {
            $scope.bgMenuImgUrl = bgrUrl;
        } else {
            $scope.bgMenuImgUrl = CONSTANT.MENU_BG_IMG_URL;
        }
    }

    var onSidebarCategoryFocusedTimer;

    function onSidebarCategoryFocused($event, item, $index) {
        if (onSidebarCategoryFocusedTimer) {
            // console.log("onSidebarCategoryFocusedTimer...");
            $timeout.cancel(onSidebarCategoryFocusedTimer);
        }
        onSidebarCategoryFocusedTimer = $timeout(function () {
            // console.log("onSidebarCategoryFocused...");
            $scope.isVodCategoryOpened = false;
            if (!item) {
                return;
            }

            $scope.selectedSidebarCategory = item;
            $scope.vodListByCategory = [];
            $scope.isVodCategoryOpened = false;
            moveCategoryVodContainer(0); //reset container position
            $('.item-fadeout').removeClass('item-fadeout'); //clear hidden item in container


            if (isLoadNewCategory) { // load new contents whenever select menu
                item.vodListByCategory = [];
                isLoadNewCategory = false;
            }

            if (item.vodListByCategory && item.vodListByCategory.length > 0) {
                $scope.vodListByCategory = item.vodListByCategory;
                $scope.overview = null;
                $timeout(function () {
                    $scope.isMainLoaderShown = false;
                }, 500);

            } else {
                var offset = 0;
                var limit = 24;
                if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.CHANNEL) {
                    if ($index === 0) { // all channels
                        $scope.vodListByCategory = allChannelList;
                        item.vodListByCategory = allChannelList;
                    } else {
                        var tempChannelList = [];
                        angular.forEach(allChannelList, function (channelItem, key) {
                            var configServices = ',' + $scope.selectedSidebarCategory.CONFIG_SERVICES + ',';
                            if (configServices.indexOf(',' + channelItem.service_id + ',') >= 0) {
                                tempChannelList.push(channelItem);
                            }
                            $scope.vodListByCategory = tempChannelList;
                            item.vodListByCategory = tempChannelList;
                        });
                    }
                    $scope.overview = null;
                    $timeout(function () {
                        $scope.isMainLoaderShown = false;
                    }, 500);

                } else {
                    retrieveVodListInCategory($scope.selectedSidebarCategory, limit, offset);
                }
            }
        }, 200);
    }

    function getMoreVodsInCategory(callback) {
        var selectedSidebarCategory = $scope.selectedSidebarCategory;
        var offset = selectedSidebarCategory.vodListByCategory.length;
        var limit = offset + 24;
        retrieveVodListInCategory(selectedSidebarCategory, limit, offset, callback);
    }

    function retrieveVodListInCategory(sidebarCategory, limit, offset, callback) {
        var cb = callback || angular.noop;
        $scope.isMainLoaderShown = true;
        if (UltilService.isSeriesCategory(sidebarCategory)) {
            DataService.getCategorySeriesVodListByCategoryId(UltilService.getVodCategoryId(sidebarCategory), limit, offset).then(function success(response) {
                var seriesVodList = response;
                if (seriesVodList) {
                    if (!sidebarCategory.vodListByCategory) {
                        sidebarCategory.vodListByCategory = [];
                    }
                    sidebarCategory.vodListByCategory = sidebarCategory.vodListByCategory.concat(seriesVodList);
                    $scope.vodListByCategory = sidebarCategory.vodListByCategory
                    $scope.overview = null;
                    $timeout(function () {
                        $scope.isMainLoaderShown = false;
                    }, 500);

                    return cb();
                }
            }, function error(response) {
                console.error('Loi trong qua trinh goi getVodListByCategoryId!');
                console.error(response);
                setTimeout(function () {
                    console.info('Reload when Connection Reset By Peer ...............................! ');
                }, 200);
            });
        } else {
            DataService.getCategoryVodListByCategoryId(UltilService.getVodCategoryId(sidebarCategory), limit, offset).then(function success(response) {
                var vodList = response;
                if (vodList) {
                    if (!sidebarCategory.vodListByCategory) {
                        sidebarCategory.vodListByCategory = [];
                    }
                    sidebarCategory.vodListByCategory = sidebarCategory.vodListByCategory.concat(vodList);
                    $scope.vodListByCategory = sidebarCategory.vodListByCategory
                    // sidebarCategory.vodListByCategory = $scope.vodListByCategory;
                    $scope.overview = null;
                    $timeout(function () {
                        $scope.isMainLoaderShown = false;
                    }, 500);

                    return cb();
                }
            }, function error(response) {
                console.error('Loi trong qua trinh goi getVodListByCategoryId!');
                console.error(response);
                setTimeout(function () {
                    console.info('Reload when Connection Reset By Peer ...............................! ');
                    // $state.reload();
                    // processVODList(menuItem, index);
                }, 200);
            });
        }
    }

    $scope.isPlayerShown = false;

    function onChannelSelected($event, category, data) {
        console.log("onChannelSelected:", $scope.currentDepth);
        if (!data) {
            return;
        }


        if (!$scope.isAuthenticated()) {
            LoginService.openLoginPage(function () {
                console.log("openLoginPage:", $scope.currentDepth);
                $scope.lastDepth = $scope.currentDepth;
                changeDepth($scope.DEPTH.LOGIN, function () {
                });

            });
        } else {
            $scope.channelOverview = data;
            $scope.currentOverview = data;

            if ($scope.channelOverview.encryption) {

                toaster.clear('*');
                toaster.pop({
                    type: 'error',
                    title: 'Kênh chưa được hỗ trợ!',
                    body: 'Kênh hiện tại chưa được hỗ trợ trên ứng dụng dành cho SmartTV. Quý khách vui lòng xem nội dung kênh trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                    timeout: 10000,
                    toasterId: 1
                });
                return;
                // toaster.clear(toastInstance);
            }

            playingChannel = $scope.channelOverview;
            playChannel($scope.channelOverview);

        }

        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function playChannel(channelItem) {
        VideoService.stopStream(video);
        video = $('#videoMainPlay')[0];

        $scope.isMediaLoaderHidden = false;

        // changeDepth($scope.DEPTH.PLAYER);
        $scope.isPlayerShown = true;
        // console.log("$scope.channelOverview.....................:", $scope.channelOverview);
        DataService.getChannelProduct(channelItem.channelId).then(function success(response) {
            console.log("getChannelProduct....................:", response);
            var channelProduct = response;
            var playable = false;

            if (channelProduct.encryption) {
                // $scope.isMediaLoaderHidden = true;

                toaster.clear('*');
                toaster.pop({
                    type: 'error',
                    title: 'Kênh chưa được hỗ trợ!',
                    body: 'Kênh hiện tại chưa được hỗ trợ trên ứng dụng dành cho SmartTV. Quý khách vui lòng xem nội dung kênh trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                    timeout: 10000,
                    toasterId: 1
                });
                return;
                // toaster.clear(toastInstance);
            }

            if (channelProduct.isVisiable) {
                if (channelProduct.isPublish) {
                    playable = true;
                } else {
                    if (channelProduct.isExclusivePackage) {
                        if (channelProduct.isPurchasedExclusive) {
                            playable = true;
                        }
                    } else if (channelProduct.isVtvCab) {
                        if (channelProduct.isPurchasedPackage) {
                            playable = true;
                        }
                    } else {
                        if (channelProduct.isFreeNoPair) {
                            playable = true;
                        } else {
                            if (channelProduct.isWifiPackage || channelProduct.isPurchasedPackage) {
                                playable = true;
                            }
                        }
                    }
                }

                if (playable) {
                    $(".background-layer").css('z-index', 23);
                    $(".wrapper-container").css('z-index', 24);
                    changeDepth($scope.DEPTH.PLAYER);
                    // $(".channel-page").hide();
                    // $(".list-wrapper.page").hide();


                    // $(".background-layer").hide();
                    // $scope.isPlayerShown = false;

                    VideoService.playChannelStream(channelProduct.service_id, video).then(function success(response) {
                        $timeout(function () {

                            // $scope.lastDepth = $scope.currentDepth;

                            $timeout(function () {
                                $timeout(function () {
                                    // $(".channel-page").fadeOut(1000, "linear");
                                    $scope.isChannelHeaderShown = false;
                                }, 5000);
                                $scope.isListPageFadeOut = true;
                                // $scope.isPlayerShown = true;
                                $scope.isMediaLoaderHidden = true;
                            }, 1000);

                            $(".background-layer").fadeOut(2000, "linear", function () {

                                $(".background-layer").css('z-index', 21);
                                $(".wrapper-container").css('z-index', 21);
                            });

                        }, 300);

                    }, function error(errorData) {
                        if (errorData.name === "ENCRYPTED_CONTENT_ERROR") {
                            $scope.isMediaLoaderHidden = true;

                            toaster.clear('*');
                            toaster.pop({
                                type: 'error',
                                title: 'Nội dung chưa được hỗ trợ',
                                body: 'Nội dung chưa được hỗ trợ trên ứng dụng cho SmartTV. Vui lòng xem nội dung trên Set-Top-Box hoặc ứng dụng Viettel trên điện thoại!',
                                timeout: 10000,
                                toasterId: 1
                            });
                            // toaster.clear(toastInstance);

                        }
                        console.error('load  playVODStream error :', errorData.description);
                    });

                } else {
                    toaster.clear('*');
                    toaster.pop({
                        type: 'error',
                        title: 'Chưa mua dịch vụ',
                        body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                        timeout: 10000,
                        toasterId: 1
                    });
                    // toaster.clear(toastInstance);
                }
            } else {

                toaster.clear('*');
                toaster.pop({
                    type: 'warning',
                    title: 'Không xem được Nội dung',
                    body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                    timeout: 10000,
                    toasterId: 1
                });
                $scope.isMediaLoaderHidden = true;
            }


        }, function error(response) {
            console.error('Loi trong qua trinh goi getChannelProduct!');
            console.error(response);

        });
    }

    function onQuickChannelSelected($event, category, data) {
        console.log('onQuickChannelSelected ,,,.....!');
        if (!data) {
            return;
        }

        previousPlayingChannel = playingChannel;
        playingChannel = data;

        if (playingChannel.encryption) {
            // $scope.isMediaLoaderHidden = true;

            toaster.clear('*');
            toaster.pop({
                type: 'error',
                title: 'Kênh chưa được hỗ trợ!',
                body: 'Kênh hiện tại chưa được hỗ trợ trên ứng dụng dành cho SmartTV. Quý khách vui lòng xem nội dung kênh trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                timeout: 10000,
                toasterId: 1
            });
            return;
            // toaster.clear(toastInstance);
        }

        VideoService.stopStream(video);
        video = $('#videoMainPlay')[0];

        if (!($scope.currentDepth === $scope.DEPTH.PLAYER && $scope.isChannelQuicklistShown)) {
            $scope.isMediaLoaderHidden = false;
        }

        // changeDepth($scope.DEPTH.PLAYER);
        $scope.isPlayerShown = true;
        $scope.isMediaLoaderHidden = false;

        DataService.getChannelProduct(playingChannel.channelId).then(function success(response) {
            var channelProduct = response;
            var playable = false;
            if (channelProduct.encryption) {
                // $scope.isMediaLoaderHidden = true;

                toaster.clear('*');
                toaster.pop({
                    type: 'error',
                    title: 'Kênh chưa được hỗ trợ!',
                    body: 'Kênh hiện tại chưa được hỗ trợ trên ứng dụng dành cho SmartTV. Quý khách vui lòng xem nội dung kênh trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                    timeout: 10000,
                    toasterId: 1
                });
                return;
                // toaster.clear(toastInstance);
            }

            if (channelProduct.isVisiable) {
                if (channelProduct.isPublish) {
                    playable = true;
                } else {
                    if (channelProduct.isExclusivePackage) {
                        if (channelProduct.isPurchasedExclusive) {
                            playable = true;
                        }
                    } else if (channelProduct.isVtvCab) {
                        if (channelProduct.isPurchasedPackage) {
                            playable = true;
                        }
                    } else {
                        if (channelProduct.isFreeNoPair) {
                            playable = true;
                        } else {
                            if (channelProduct.isWifiPackage || channelProduct.isPurchasedPackage) {
                                playable = true;
                            }
                        }
                    }
                }

                if (playable) {
                    toaster.clear('*');
                    VideoService.playChannelStream(playingChannel.channelId, video).then(function success(response) {
                        $timeout(function () {
                            // $scope.lastDepth = $scope.currentDepth;
                            $scope.isMediaLoaderHidden = true;
                        }, 300);
                    }, function error(errorData) {
                        $scope.isMediaLoaderHidden = true;
                        if (errorData.name === "ENCRYPTED_CONTENT_ERROR") {
                            // $scope.isMediaLoaderHidden = true;

                            $scope.back();
                            toaster.clear('*');
                            toaster.pop({
                                type: 'error',
                                title: 'Nội dung không hỗ trợ',
                                body: 'Nội dung chưa được hỗ trợ trên TV. Vui lòng xem nội dung trên Set-Top-Box hoặc ứng dụng Viettel trên điện thoại!',
                                timeout: 10000,
                                toasterId: 1
                            });
                            // toaster.clear(toastInstance);

                        }
                        console.error('load  playVODStream error :', errorData.description);
                    });

                } else {
                    $scope.isMediaLoaderHidden = true;
                    toaster.clear('*');
                    toaster.pop({
                        type: 'error',
                        title: 'Chưa mua dịch vụ',
                        body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                        timeout: 10000,
                        toasterId: 1
                    });
                    // toaster.clear(toastInstance);
                }
            } else {

                toaster.clear('*');
                toaster.pop({
                    type: 'warning',
                    title: 'Không xem được Nội dung',
                    body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                    timeout: 10000,
                    toasterId: 1
                });
                $scope.isMediaLoaderHidden = true;
            }


        }, function error(response) {
            console.error('Loi trong qua trinh goi getChannelProduct!');
            console.error(response);

        });



        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function onChannelBlurred($event, category, data) {
        $scope.isOverviewDark = true;
        $scope.channelWatchPreviewLoaded = false;
    }

    // The callback function which is called when user select one item of the list component.
    function onVodSelected($event, category, item, $index) {
        if (item.loaded === false) {
            return;
        }
        goToVodDetailPage(item, $event);
    }

    function onCategoryVodSelected($event, item, $index) {

        if (item.loaded === false) {
            return;
        }


        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.CHANNEL) {
            if (!$scope.isAuthenticated()) {
                LoginService.openLoginPage(function () {
                    console.log("openLoginPage:", $scope.currentDepth);
                    $scope.lastDepth = $scope.currentDepth;
                    changeDepth($scope.DEPTH.LOGIN, function () {

                        // $timeout(function() {
                        //     console.log("focused :", $('.login-account-row'));
                        //     focusController.focus($('.login-account-row'));

                        // }, 300);

                    });

                });
            } else {

                $scope.channelOverview = item;
                $scope.currentOverview = item;
                if (previousPlayingChannel) {
                    previousPlayingChannel = null;
                }

                playingChannel = item;

                if ($scope.channelOverview.encryption) {
                    // $scope.isMediaLoaderHidden = true;

                    toaster.clear('*');
                    toaster.pop({
                        type: 'error',
                        title: 'Kênh chưa được hỗ trợ!',
                        body: 'Kênh hiện tại chưa được hỗ trợ trên ứng dụng dành cho SmartTV. Quý khách vui lòng xem nội dung kênh trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                        timeout: 10000,
                        toasterId: 1
                    });
                    return;
                    // toaster.clear(toastInstance);
                }


                VideoService.stopStream(video);
                video = $('#videoMainPlay')[0];
                $scope.isMediaLoaderHidden = false;
                // $scope.channelOverview =
                // $scope.lastDepth = $scope.DEPTH.CATEGORY;
                // changeDepth($scope.DEPTH.PLAYER);
                DataService.getChannelProduct($scope.channelOverview.channelId).then(function success(response) {
                    var channelProduct = response;
                    var playable = false;

                    if (channelProduct.isVisiable) {
                        if (channelProduct.isPublish) {
                            playable = true;
                        } else {
                            if (channelProduct.isExclusivePackage) {
                                if (channelProduct.isPurchasedExclusive) {
                                    playable = true;
                                }
                            } else if (channelProduct.isVtvCab) {
                                if (channelProduct.isPurchasedPackage) {
                                    playable = true;
                                }
                            } else {
                                if (channelProduct.isFreeNoPair) {
                                    playable = true;
                                } else {
                                    if (channelProduct.isWifiPackage || channelProduct.isPurchasedPackage) {
                                        playable = true;
                                    }
                                }
                            }
                        }

                        if (playable) {
                            changeDepth($scope.DEPTH.PLAYER);
                            toaster.clear('*');
                            VideoService.playChannelStream($scope.channelOverview.channelId, video).then(function success(response) {
                                $timeout(function () {
                                    // $scope.lastDepth = $scope.currentDepth;
                                    $scope.isPlayerShown = true;
                                    $scope.isMediaLoaderHidden = true;
                                    $timeout(function () {
                                        // changeDepth($scope.DEPTH.PLAYER);
                                        // if (!($scope.currentDepth === $scope.DEPTH.PLAYER && $scope.isChannelQuicklistShown)) {
                                        //     changeDepth($scope.DEPTH.PLAYER);
                                        // $(".category-page").fadeOut(4000, "linear");
                                        //     $(".channel-page").fadeOut(4000, "linear");


                                        // }
                                        $(".category-page").fadeOut(1000, "linear");
                                    }, 3000);

                                    $(".background-layer").fadeOut(2000, "linear");
                                }, 300);
                            }, function error(errorData) {
                                if (errorData.name === "ENCRYPTED_CONTENT_ERROR") {
                                    $scope.isMediaLoaderHidden = true;

                                    $scope.back();
                                    toaster.clear('*');
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Nội dung không hỗ trợ',
                                        body: 'Nội dung chưa được hỗ trợ trên TV. Vui lòng xem nội dung trên Set-Top-Box hoặc ứng dụng Viettel trên điện thoại!',
                                        timeout: 10000,
                                        toasterId: 1
                                    });
                                    // toaster.clear(toastInstance);

                                }
                                console.error('load  playVODStream error :', errorData.description);
                            });

                        } else {
                            toaster.clear('*');
                            toaster.pop({
                                type: 'error',
                                title: 'Chưa mua dịch vụ',
                                body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                                timeout: 10000,
                                toasterId: 1
                            });
                            // toaster.clear(toastInstance);
                        }
                    } else {

                        toaster.clear('*');
                        toaster.pop({
                            type: 'warning',
                            title: 'Không xem được Nội dung',
                            body: 'Quý khách vui lòng đăng ký gói cước trên ứng dụng ViettelTV dành cho SmartPhone/Máy tính bảng iOS/Android hoặc truy cập website http://vietteltv.vn',
                            timeout: 10000,
                            toasterId: 1
                        });
                        $scope.isMediaLoaderHidden = true;
                    }


                }, function error(response) {
                    console.error('Loi trong qua trinh goi getChannelProduct!');
                    console.error(response);

                });
            }

            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        } else {
            $scope.isMainLoaderShown = true;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            lastCategoryVodFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            // $scope.lastDepth = $scope.DEPTH.CATEGORY;
            $scope.lastDepthZone = '';
            goToVodDetailPage(item, $event);
        }
    }

    function onRelatedVodSelected($event, category, item, $index) {
        if (item.loaded === false) {
            return;
        }
        playVOD(item);
    }

    function onEpisodeVodSelected($event, category, data, $index) {
        if (!data || !data.item || data.item.loaded === false) {
            return;
        }
        playVOD(data.item);
    }

    function goToVodDetailPage(vod, $event) {
        console.log("gotoDetail:", vod);
        $scope.currentItemData = null;
        var depth;
        depth = $scope.DEPTH.DETAIL;
        depth && changeDepth(depth);

        $scope.currentDepthZone = 0;
        $scope.isInfoShownInPlayer = true;
        // $scope.lastDepth = $scope.DEPTH.DETAIL;
        detailPlayFocusedGroup = FocusUtil.getData($event.currentTarget).group;

        $('.related-play-list').css('z-index', 23);
        $('.episode-play-list').css('z-index', 23);
        // updateOverview();
        // if (lastFocusedGroup !== 'VOD_LIST_CATEGORY') {
        // updateRelatedEpisodeListInDetail(vod);
        // } else {
        vod.relateds = [];
        vod.episodes = [];
        if (vod.isVodInSeries) {
            DataService.getRelatedVodList(vod.program.programId).then(function (relatedVodList) {
                vod.relateds = relatedVodList;
                var seriesId = vod.program.series.id;
                DataService.getEpisodesInSeries(seriesId).then(function (episodeVodList) {
                    vod.episodes = episodeVodList;
                    updateRelatedEpisodeListInDetail(vod);
                }, function (response) { });
            }, function error(response) {
                console.error('Loi trong qua trinh goi DataService.getRelatedVodList! Response = ');
                console.error(response);
            });
        } else if (vod.isSeries) {
            DataService.getEpisodeListBySeriesId(vod.id).then(function (episodeVodList) {
                vod = episodeVodList[0];
                vod = UltilService.transformVOD(vod);
                vod.episodes = episodeVodList;
                DataService.getRelatedVodList(vod.program.id).then(function (relatedVodList) {
                    vod.relateds = relatedVodList;
                    updateRelatedEpisodeListInDetail(vod);
                });
            }, function error(response) {
                console.error('Loi trong qua trinh goi DataService.getEpisodeListBySeriesId! Response = ');
                console.error(response);
            });
        } else {
            DataService.getRelatedVodList(vod.program.id).then(function (relatedVodList) {
                vod.relateds = relatedVodList;
                updateRelatedEpisodeListInDetail(vod);
            }, function error(response) {
                console.error('Loi trong qua trinh goi DataService.getRelatedVodList! Response = ');
                console.error(response);
            });
        }
        // }
    }

    function updateRelatedEpisodeListInDetail(vod) {
        $scope.relatedPlaylist = vod.relateds;
        $scope.episodePlaylist = vod.episodes;
        $scope.currentDetailRelatedList = $scope.relatedPlaylist;
        $scope.currentDetailOverview = vod;
        currentItemData = vod;
        $scope.isRelatedShown = false; //show related list on detail vod page
        $scope.isEpisodeShown = false;
        $scope.isEpisodeBtnNotShown = true;
        if ($scope.relatedPlaylist.length > 0) {
            $scope.isRelatedShown = true; //show related list on detail vod page
            if ($scope.episodePlaylist.length > 0) {
                $scope.isEpisodeBtnNotShown = false;
            } else {
                $scope.isEpisodeBtnNotShown = true;
            }
        } else {
            $scope.isRelatedShown = false;
            if ($scope.episodePlaylist.length > 0) {
                $scope.isEpisodeShown = true;
                $scope.isEpisodeBtnNotShown = true;
            } else {
                $scope.isEpisodeShown = false;
                $scope.isEpisodeBtnNotShown = false;
            }
        }
        // var depth;
        // depth = $scope.DEPTH.DETAIL;
        // depth && changeDepth(depth);
        updateOverview();
        if ($scope.lastDepthZone !== $scope.DEPTH_ZONE.INDEX.SPOTLIGHT && vod.isSpotlight !== true) {
            $scope.isVodShown = true;
            setVodDetailPackground(vod.bigPhotoUrl);
        }

        if (vod.isSpotlight === true) {
            // setSpotlightPackground(vod.bigPhotoUrl);
            $scope.isVodShown = false;
            $scope.isSpotlightShown = true;

        }

        $scope.isMainLoaderShown = false;
        $scope.isMenuShown = false;


        $timeout(function () {
            $('#list-related-vod').trigger('reload');
            $('#list-episode-vod').trigger('reload');
        }, 0);
    }
    $scope.isRelatedShown = false;

    function onBtnVodPlayFocusInDetail($event, $originalEvent) {
        $scope.isFromVodDetail = true;
        if ($scope.currentDetailOverview) {
            $scope.overview = $scope.currentDetailOverview;
        }

        if ($scope.currentDetailRelatedList) {
            $scope.relatedPlaylist = $scope.currentDetailRelatedList;
        }

        if ($scope.currentDetailEpisodeList) {
            $scope.episodePlaylist = $scope.currentDetailEpisodeList;
        }

        if ($scope.lastDepthZone !== $scope.DEPTH_ZONE.INDEX.SPOTLIGHT && $scope.lastDepth !== $scope.DEPTH.PLAYER && $scope.lastDepth !== $scope.DEPTH.CATEGORY) {
            updateRelatedEpisodeListInDetail($scope.currentDetailOverview);
        }
        // $scope.lastDepth = $scope.DEPTH.DETAIL;
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        $scope.lastDepthZone = $scope.DEPTH_ZONE.DETAIL.SPOTLIGHT;
    }

    function onBtnVodEpisodeFocusInDetail($event, $originalEvent) {
        $scope.isOverviewDark = false;
        $scope.isEpisodeShown = true;
        $scope.isRelatedShown = false;
        if ($scope.currentDetailOverview) {
            $scope.overview = $scope.currentDetailOverview;
        }
        if ($scope.currentDetailEpisodeList) {
            $scope.episodePlaylist = $scope.currentDetailEpisodeList;
        }
    }

    function onBtnVodRelatedFocusInDetail($event, $originalEvent) {
        $scope.isOverviewDark = false;
        $scope.isEpisodeShown = false;
        if ($scope.relatedPlaylist.length > 0) {
            $scope.isRelatedShown = true; //show related list on detail vod page
        }
    }

    function onBtnViewSpotlightFocused($event, $originalEvent) {
        currentItemData = $scope.lastOverview;
        $scope.currentFocusItem = focusController.getCurrentFocusItem();
        var currentCategory = $($scope.currentFocusItem).parents('.list-area');

        if ($scope.overview && $scope.overview.isChannel) {
            VideoService.stopStream(video);
            $scope.lastDepthZone = $scope.currentDepthZone;
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
            $scope.spotlightOverview = $scope.lastOverview;
            //change background on spotlight
            // setSpotlightPackground(currentSpotlight.bigPhotoUrl, function() {
            //     // focusController.focus('btnView');
            // });
            $('.list-category').css({
                transform: 'translate3d(0, 0px, 0)'
            });
        } else {
            $scope.spotlightOverview = currentSpotlight;
            console.log("2222");
            $scope.bgImgCoverOpacity = 1;
            //change background on spotlight
            moveToSpotlightDown();
        }

        setSpotlightPackground();
        $scope.isSpotlightShown = true;
        $scope.isMenuShown = false;
        $scope.currentCategory = '';
        $scope.currentDetailOverview = null;
        $scope.isForceChannelInfoShown = false;


    }

    function playVOD(vod) {
        if (!$scope.isAuthenticated()) {
            LoginService.openLoginPage(function () {
                // $scope.lastDepth = $scope.DEPTH.DETAIL;
                changeDepth($scope.DEPTH.LOGIN);
                focusController.focus('btnLogin');
            });
        } else {

            video = $('#videoMainPlay')[0];
            if ($rootScope.isAppLoadedAfterLogin) {
                // $scope.lastDepth = $scope.DEPTH.DETAIL;
                playVODStream(vod, video, function streamEnded() {
                    // $scope.back();
                });
            } else {
                DataService.getVodDetails($scope.overview.program.id).then(function success(responseVod) {
                    $scope.overview = responseVod;
                    // $scope.lastDepth = $scope.DEPTH.DETAIL;
                    playVODStream($scope.overview, video, function streamEnded() {
                        // $scope.back();
                    });
                }, function error(response) {
                    console.error('load  playVODStream error : ---- : ', response);
                });
            }
        }
    }

    function onBtnVodPlaySelected($event) {

        if ($scope.currentDepth === $scope.DEPTH.PLAYER) {
            return;
        }

        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        playVOD($scope.overview);
    }


    function onBtnViewSpotlightSelected($event, item) {



        $scope.isMainLoaderShown = true;
        $scope.lastDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
        goToVodDetailPage(item, $event);
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        $timeout(function () {
            $scope.isMainLoaderShown = false;
        }, 200);
    }

    $scope.isPlayDisabled = false;
    $scope.isInfoShownInPlayer = true;
    var detailSectionTimmer;
    var processPlayerTimer;
    var videoProgressTrackTimer;
    var playTime = 0;

    function playVODStream(vod, video, callback) {
        console.log('playVodStream .... vod', vod);
        if ($scope.currentDepth === $scope.DEPTH.PLAYER) return;

        if (vod.isEncrypted) {
            $scope.isMediaLoaderHidden = true;
            $scope.isPlayDisabled = false;
            // $scope.back();
            toaster.clear('*');
            toaster.pop({
                type: 'error',
                title: 'Nội dung chưa hỗ trợ!',
                body: 'Nội dung này chưa được hỗ trợ trên ứng dụng cho SmartTV. Quý khách vui lòng xem nội dung này trên Truyền hình số Viettel hoặc ứng dụng ViettelTV dành cho SmartPhone hoặc Máy tính bảng iOS/ Android.',
                timeout: 12000,
                toasterId: 2
            });
            return;
        }

        $scope.isPlayDisabled = true;
        var playable = false;
        if (vod.isExclusivePackage) {
            if (vod.isPurchasedExclusive) {
                playable = true;
            }
        } else {
            if (vod.isFreeNoPair || vod.isWifiPackage || vod.isPurchasedPackage) {
                playable = true;
            }
        }
        if (playable) {
            $scope.isMediaLoaderHidden = false;



            VideoService.playVODStream(vod, video, callback).then(function success(response) {

                $scope.lastDepth = $scope.currentDepth;
                processPlayerTimer = $timeout(function () {
                    changeDepth($scope.DEPTH.PLAYER);
                    detailSectionTimmer = $timeout(function () {
                        $(".category-section").fadeOut(4000, "linear");
                    }, 8000);
                    $scope.isMediaLoaderHidden = true;
                    $scope.showMediaController = false;
                    $scope.isPlayerShown = true;
                    $(".background-layer").fadeOut(3000, "linear");

                }, 500);
                video = $('#videoMainPlay')[0];
                $scope.overview.durationInSeconds = video.duration;
                console.log(' $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
                $scope.overview.endPosition = ($scope.overview.durationInSeconds + "").toHHMMSS();
                $scope.overview.passedDuration = Math.ceil(video.currentTime);
                playTime = Math.ceil(video.currentTime);

                if (typeof videoProgressTrackTimer !== 'undefined' && videoProgressTrackTimer !== null) return;

                videoProgressTrackTimer = $interval(function () {
                    if (video.currentTime) {
                        $scope.overview.passedDuration = Math.ceil(video.currentTime);
                        playTime += 1;
                        if (playTime < $scope.overview.durationInSeconds) {
                            // console.log('1 $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
                            // console.log('1 $scope.overview.passedDuration ...', $scope.overview.passedDuration);
                            // console.log('1 $scope.overview.playTime ...', playTime);
                            $scope.overview.passedDuration = Math.ceil(video.currentTime);
                            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
                            // console.log("playPosition:", $scope.overview.playPosition);
                        } else {
                            // console.log('2 $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
                            // console.log('2 $scope.overview.passedDuration ...', $scope.overview.passedDuration);
                            // console.log('2 $scope.overview.playTime ...', playTime);
                            if ($scope.currentDepth === $scope.DEPTH.PLAYER) {
                                $scope.back();
                            }
                            $interval.cancel(videoProgressTrackTimer);

                        }
                    }

                }, 1000);
            }, function error(errorData) {
                if (errorData.name === "ENCRYPTED_CONTENT_ERROR") {
                    $scope.isMediaLoaderHidden = true;
                    $scope.isPlayDisabled = false;
                    // $scope.back();
                    toaster.clear('*');
                    toaster.pop({
                        type: 'error',
                        title: 'Nội dung không hỗ trợ',
                        body: 'Nội dung chưa được hỗ trợ trên ứng dụng cho SmartTV. Vui lòng xem nội dung trên Set-Top-Box hoặc ứng dụng Viettel trên điện thoại!',
                        timeout: 12000,
                        toasterId: 2
                    });
                    // toaster.clear(toastInstance);

                } else if (errorData.name === "NETWORK_ERROR" || errorData.name === "UNRECOVERABLE_ERROR") {
                    $scope.isMediaLoaderHidden = true;
                    $scope.isPlayDisabled = false;
                    // $scope.back();
                    toaster.clear('*');
                    toaster.pop({
                        type: 'error',
                        title: 'Có lỗi xảy ra',
                        body: errorData.description,
                        timeout: 12000,
                        toasterId: 2
                    });
                    // toaster.clear(toastInstance);

                }
                console.error('load  playVODStream error :', errorData.description);
            });
        } else {

            toaster.clear('*');
            toaster.pop({
                type: 'warning',
                title: 'Nội dung tính phí!',
                body: 'Để xem nội dung Quý khách vui lòng đăng ký gói dịch trên ứng dụng ViettelTV phiên bản dành cho SmartPhone hoặc Máy tính bảng iOS/Android.',
                timeout: 10000,
                toasterId: 1
            });
            $scope.isMediaLoaderHidden = true;
        }
    }

    function onLoginCancelButtonSelected(event) {
        $scope.back();
    }

    function onLoginButtonSelected(event) {
        event.preventDefault();
        $scope.isMainLoaderShown = true;
        Auth.login({
            username: $scope.login.username,
            password: $scope.login.password
        }).then(function (response) {
            $scope.isMainLoaderShown = false;
            if (response.data.error) {
                $scope.authenticationError = true;
                console.error("login failed", response);
                toaster.clear('*');
                toaster.pop({
                    type: 'error',
                    title: 'Đăng nhập không thành công',
                    body: 'Số điện thoại hoặc mật khẩu không đúng!',
                    timeout: 10000,
                    toasterId: 1
                });
                // toaster.clear(toastInstance);
            } else {
                // isLoginOK = true;
                removeKeyboardListenerFunc();
                $scope.authenticationError = false;
                // alert("current deptj:",$scope.lastDepth);
                LoginService.closeLoginPage();
                Principal.identity().then(function (account) {
                    $scope.isAuthenticated = Principal.isAuthenticated;
                    toaster.clear('*');
                    toaster.pop({
                        type: 'success',
                        title: 'Đăng nhập thành công',
                        timeout: 2000,
                        toasterId: 1
                    });
                });

                $scope.back();


            }
            // $state.reload();
            // window.location.reload();
        }).catch(function (error) {
            $scope.authenticationError = true;
            console.error("login failed ..............", error);
            $scope.back();
        });
    };

    function showQuickChannelList() {
        if (($scope.isChannelQuicklistShown && (typeof previousPlayingChannel === 'undefined' || previousPlayingChannel === null)) || ((typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel !== null) && previousPlayingChannel.index === playingChannel.index)) {
            return;
        } else if ($scope.isChannelQuicklistShown && (previousPlayingChannel !== null && typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel.index !== playingChannel.index)) {
            focusController.focus($('#channel-quick-list-item-' + playingChannel.channelId));

            return;
        }

        processChannelListNow(allChannelList);
        $scope.allChannelList = allChannelList;
        $timeout(function () {
            $scope.isForceChannelInfoShown = true;
            $scope.isChannelHeaderShown = false;
            $scope.isChannelQuicklistShown = true;
            // $(".channel-page").fadeIn(500, "linear");
            $timeout(function () {
                focusController.focus($('#channel-quick-list-item-' + playingChannel.channelId));
            }, 100);
        }, 100);

        return false;
    }

    $scope.isChannel = false;
    $scope.setting = {
        subTitle: true
    };

    var start = new Date().getTime();
    var end = new Date().getTime();
    var playingChannel;
    var previousPlayingChannel;
    function processKeydownEvent() {
        document.addEventListener("click", function () {
            if ($scope.currentDepth === $scope.DEPTH.PLAYER && !$scope.currentOverview.isChannel) {
                // console.log('not channel ... ');

                if ($scope.showMediaController === false) {
                    if ($scope.isMediaLoaderHidden) {
                        console.log('setMediaControllerTimer ssss.. ');
                        $timeout(function () {
                            $scope.setMediaControllerTimer();
                            video = $('#videoMainPlay')[0];
                            $scope.overview.durationInSeconds = video.duration;
                            $scope.overview.endPosition = ($scope.overview.durationInSeconds + "").toHHMMSS();
                            $scope.overview.passedDuration = Math.ceil(video.currentTime);
                        }, 50);

                    }
                    return false;
                }

            } else if ($scope.currentDepth === $scope.DEPTH.PLAYER && $scope.currentOverview.isChannel) {
                if (($scope.isChannelQuicklistShown && (typeof previousPlayingChannel === 'undefined' || previousPlayingChannel === null)) || ((typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel !== null) && previousPlayingChannel.index === playingChannel.index)) {
                    return;
                } else if ($scope.isChannelQuicklistShown && (previousPlayingChannel !== null && typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel.index !== playingChannel.index)) {
                    return;
                }

                processChannelListNow(allChannelList);
                $scope.allChannelList = allChannelList;
                $timeout(function () {
                    $scope.isForceChannelInfoShown = true;
                    $scope.isChannelHeaderShown = false;
                    $scope.isChannelQuicklistShown = true;
                    // $(".channel-page").fadeIn(500, "linear");
                    $timeout(function () {
                        focusController.focus($('#channel-quick-list-item-' + playingChannel.channelId));
                    }, 100);
                }, 100);

                return false;
            }
        });



        focusController.addBeforeKeydownHandler(function (context) {
            console.log('context.event.keyCode ... ', context.event.keyCode);
            if (!isOnline) return;

            $scope.isChannel = false;
            if ($scope.isInitCompleted === false) return;
            if ($scope.currentDepth === $scope.DEPTH.PLAYER && !$scope.currentOverview.isChannel) {
                // console.log('not channel ... ');
                if (context.event.keyCode !== CONSTANT.KEY_CODE.RETURN && context.event.keyCode !== CONSTANT.KEY_CODE.BACK && context.event.keyCode !== CONSTANT.KEY_CODE.LG_POINT_DISAPPEARED) {
                    if ($scope.showMediaController === false) {
                        if ($scope.isMediaLoaderHidden) {
                            console.log('setMediaControllerTimer ssss.. ');
                            $timeout(function () {
                                $scope.setMediaControllerTimer();
                                video = $('#videoMainPlay')[0];
                                $scope.overview.durationInSeconds = video.duration;
                                $scope.overview.endPosition = ($scope.overview.durationInSeconds + "").toHHMMSS();
                                $scope.overview.passedDuration = Math.ceil(video.currentTime);
                            }, 50);

                        }
                        return false;
                    } else {
                        // if ($scope.isMediaLoaderHidden) {
                        //     $scope.setMediaControllerTimer();
                        // }
                    }
                }

                $scope.isChannel = false;
            } else if ($scope.currentDepth === $scope.DEPTH.PLAYER && $scope.currentOverview.isChannel) {
                $scope.isChannel = true;
                // $scope.setting.channel = true;
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.ENTER:
                        if (($scope.isChannelQuicklistShown && (typeof previousPlayingChannel === 'undefined' || previousPlayingChannel === null)) || ((typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel !== null) && previousPlayingChannel.index === playingChannel.index)) {
                            return;
                        } else if ($scope.isChannelQuicklistShown && (previousPlayingChannel !== null && typeof previousPlayingChannel !== 'undefined' && previousPlayingChannel.index !== playingChannel.index)) {
                            return;
                        }

                        processChannelListNow(allChannelList);
                        $scope.allChannelList = allChannelList;
                        $timeout(function () {
                            $scope.isForceChannelInfoShown = true;
                            $scope.isChannelHeaderShown = false;
                            $scope.isChannelQuicklistShown = true;
                            // $(".channel-page").fadeIn(500, "linear");
                            $timeout(function () {
                                focusController.focus($('#channel-quick-list-item-' + playingChannel.channelId));
                            }, 100);
                        }, 100);

                        return false;

                    case CONSTANT.KEY_CODE.CHANNEL_DOWN:
                        // $scope.channelOverview.serviceId++;
                        $scope.isMediaLoaderHidden = false;
                        if (playingChannel) {

                            previousPlayingChannel = playingChannel;
                            playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index + 1);
                            if ($scope.isChannelQuicklistShown) {
                                showQuickChannelList();
                            }

                            playChannel(playingChannel);
                        } else {
                            playingChannel = $scope.channelOverview;
                            playChannel($scope.channelOverview);
                        }

                        break;
                    case CONSTANT.KEY_CODE.LG_CHANNEL_DOWN:
                        // $scope.channelOverview.serviceId++;
                        $scope.isMediaLoaderHidden = false;
                        if (playingChannel) {

                            previousPlayingChannel = playingChannel;
                            playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index + 1);
                            if ($scope.isChannelQuicklistShown) {
                                showQuickChannelList();
                            }

                            playChannel(playingChannel);
                        } else {
                            playingChannel = $scope.channelOverview;
                            playChannel($scope.channelOverview);
                        }

                        break;
                    // case CONSTANT.KEY_CODE.DOWN:
                    //     // $scope.channelOverview.serviceId++;
                    //     $scope.isMediaLoaderHidden = false;
                    //     if (playingChannel) {

                    //         previousPlayingChannel = playingChannel;
                    //         playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index + 1);
                    //         if ($scope.isChannelQuicklistShown) {
                    //             showQuickChannelList();
                    //         }

                    //         playChannel(playingChannel);
                    //     } else {
                    //         playingChannel = $scope.channelOverview;
                    //         playChannel($scope.channelOverview);
                    //     }

                    //     break;

                    case CONSTANT.KEY_CODE.CHANNEL_UP:
                        if (playingChannel.index === 0) {
                            return;
                        }
                        // $scope.channelOverview.serviceId--;
                        $scope.isMediaLoaderHidden = false;
                        if (playingChannel) {
                            previousPlayingChannel = playingChannel;
                            playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index - 1);
                            if ($scope.isChannelQuicklistShown) {
                                showQuickChannelList();
                            }

                            playChannel(playingChannel);
                        } else {
                            playingChannel = $scope.channelOverview;
                            playChannel($scope.channelOverview);
                        }

                        break;
                    case CONSTANT.KEY_CODE.LG_CHANNEL_UP:
                        if (playingChannel.index === 0) {
                            return;
                        }
                        // $scope.channelOverview.serviceId--;
                        $scope.isMediaLoaderHidden = false;
                        if (playingChannel) {
                            previousPlayingChannel = playingChannel;
                            playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index - 1);
                            if ($scope.isChannelQuicklistShown) {
                                showQuickChannelList();
                            }

                            playChannel(playingChannel);
                        } else {
                            playingChannel = $scope.channelOverview;
                            playChannel($scope.channelOverview);
                        }

                        break;
                    // case CONSTANT.KEY_CODE.UP:
                    //     if (playingChannel.index === 0) {
                    //         return;
                    //     }
                    //     // $scope.channelOverview.serviceId--;
                    //     $scope.isMediaLoaderHidden = false;
                    //     if (playingChannel) {
                    //         previousPlayingChannel = playingChannel;
                    //         playingChannel = UltilService.getChannelByIndex(allChannelList, playingChannel.index - 1);
                    //         if ($scope.isChannelQuicklistShown) {
                    //             showQuickChannelList();
                    //         }

                    //         playChannel(playingChannel);
                    //     } else {
                    //         playingChannel = $scope.channelOverview;
                    //         playChannel($scope.channelOverview);
                    //     }

                    //     break;
                }


            }

            if ($scope.currentDepth === $scope.DEPTH.CATEGORY) {
                $scope.currentFocusItem = focusController.getCurrentFocusItem();
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.UP:
                        // if ($scope.currentFocusItem.id === 'sidebar-category-item-0') {
                        //     $scope.back();
                        // }
                        break;
                    case CONSTANT.KEY_CODE.DOWN:
                        break;
                    case CONSTANT.KEY_CODE.RETURN:
                    case CONSTANT.KEY_CODE.BACK:
                    case CONSTANT.KEY_CODE.ESC:
                        $scope.back();
                        break;
                }
            } else {
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.UP:
                        break;
                    case CONSTANT.KEY_CODE.DOWN:
                        break;
                    case CONSTANT.KEY_CODE.RETURN:
                    case CONSTANT.KEY_CODE.BACK:
                    case CONSTANT.KEY_CODE.ESC:
                        $scope.back();
                        break;
                }
            }
        });
    }

    function mediaTogglePlay(isPlaying) { // Change button shape by '$scope.isPlaying' ('Play' <-> 'Pause')
        if (!$scope.currentOverview.isChannel) {
            console.log('mediaTogglePlay channel...', isPlaying);
            $scope.$applyAsync(function () {
                $scope.isPlaying = isPlaying;
            });
        }

        console.log('mediaTogglePlay...', isPlaying);
        if (!$scope.currentOverview.isChannel && !isPlaying) {

            console.log('cancel videoProgressTrackTimer...', isPlaying);
            $interval.cancel(videoProgressTrackTimer);
            videoProgressTrackTimer = null;

            if (playTime > $scope.overview.durationInSeconds - 3) {
                $scope.back();
            }

            return;
        }

        if (!$scope.currentOverview.isChannel && isPlaying) {
            if (typeof videoProgressTrackTimer !== 'undefined' && videoProgressTrackTimer !== null) return;

            // console.log('start videoProgressTrackTimer...', isPlaying);
            video = $('#videoMainPlay')[0];
            $scope.overview.durationInSeconds = video.duration;
            // console.log(' $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
            $scope.overview.endPosition = ($scope.overview.durationInSeconds + "").toHHMMSS();
            $scope.overview.passedDuration = Math.ceil(video.currentTime);
            playTime = Math.ceil(video.currentTime);

            videoProgressTrackTimer = $interval(function () {
                $scope.overview.passedDuration = Math.ceil(video.currentTime);
                playTime += 1;
                if (playTime < $scope.overview.durationInSeconds) {
                    // console.log('1 $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
                    // console.log('1 $scope.overview.passedDuration ...', $scope.overview.passedDuration);
                    // console.log('1 $scope.overview.playTime ...', playTime);
                    $scope.overview.passedDuration = Math.ceil(video.currentTime);
                    $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
                    // console.log("playPosition:", $scope.overview.playPosition);
                } else {
                    // console.log('2 $scope.overview.durationInSeconds...', $scope.overview.durationInSeconds);
                    // console.log('2 $scope.overview.passedDuration ...', $scope.overview.passedDuration);
                    // console.log('2 $scope.overview.playTime ...', playTime);
                    if ($scope.currentDepth === $scope.DEPTH.PLAYER) {
                        $scope.back();
                    }
                    $interval.cancel(videoProgressTrackTimer);

                }
            }, 1000);
        }

    }

    function mediaPause() {
        console.log('pausepause .....');
        if (!$scope.currentOverview.isChannel) {
            $interval.cancel(videoProgressTrackTimer);

            if (playTime > $scope.overview.durationInSeconds - 3) {
                $scope.back();
            }
        }
    }

    function mediaEnded() {
        console.log('mediaEnded .....');
        if (!$scope.currentOverview.isChannel) {
            $interval.cancel(videoProgressTrackTimer);
            $scope.back();
        }
    }

    function mediaForward() {
        console.log('mediaForward .....');
        if (!$scope.currentOverview.isChannel) {
            $scope.overview.passedDuration += 15;
            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
        }
    }

    function mediaRewind() {
        console.log('mediaRewind .....');
        if (!$scope.currentOverview.isChannel) {
            $scope.overview.passedDuration -= 15;
            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
        }
    }

    function mediaRestart() {
        console.log('mediaRestart .....');
        if (!$scope.currentOverview.isChannel) {
            $scope.overview.passedDuration -= 120;
            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
        }
    }

    function mediaNext() {
        console.log('mediaNext .....');
        if (!$scope.currentOverview.isChannel) {
            $scope.overview.passedDuration += 120;
            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
        }
    }

    function mediaSeeked() {
        console.log('mediaSeeked .....');
        video = $('#videoMainPlay')[0];
        if (!$scope.currentOverview.isChannel) {
            $scope.overview.passedDuration = Math.ceil(video.currentTime);
            playTime = Math.ceil(video.currentTime);
            $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
        }



    }

    function mediaSeeking() {
        video = $('#videoMainPlay')[0];
        // console.log('mediaSeeked .....');
        // console.log('currentTime .....', video.currentTime);
        // console.log('time .....', video.time);
        // console.log('duration .....', video.duration);


    }

    function getPlayerControls() {
        return {
            play: function () {
                console.log('play .....');
                $timeout(function () {
                    $('#player .icon-caph-play').parent().trigger('selected');
                    if (!$scope.currentOverview.isChannel) {
                        $interval.cancel(videoProgressTrackTimer);
                        videoProgressTrackTimer = $interval(function () {
                            if ($scope.overview.passedDuration < $scope.overview.durationInSeconds) {
                                $scope.overview.passedDuration += 1;
                                $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
                                // console.log("playPosition:", $scope.overview.playPosition);
                            } else {
                                console.log('Ending progress bar.');
                                $interval.cancel(videoProgressTrackTimer);
                                if ($scope.currentDepth === $scope.DEPTH.PLAYER) {
                                    $scope.back();
                                }
                            }
                        }, 1000);
                    }
                }, 500);
            },
            pause: function () {
                console.log('pause .....');
                $('#player .icon-caph-pause').parent().trigger('selected');
                if (!$scope.currentOverview.isChannel) {
                    $interval.cancel(videoProgressTrackTimer);
                }
            },
            restart: function () {
                $('#player .icon-caph-prev').parent().trigger('selected');
                $scope.overview.passedDuration -= 120;
                $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
            },
            rewind: function () {
                $('#player .icon-caph-rewind').parent().trigger('selected');
                $scope.overview.passedDuration -= 15;
                $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
            },
            forward: function () {
                console.log('forward .....');
                $('#player .icon-caph-forward').parent().trigger('selected');
                $scope.overview.passedDuration += 15;
                $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();
            },
            next: function () {
                $('#player .icon-caph-next').parent().trigger('selected');
                $scope.overview.passedDuration += 120;
                $scope.overview.playPosition = ($scope.overview.passedDuration + "").toHHMMSS();

            }
        };
    }

    var mediaControllerTimer;

    function setMediaControllerTimer() {
        $scope.showMediaController = true;
        if (mediaControllerTimer) {
            $timeout.cancel(mediaControllerTimer);
        }
        mediaControllerTimer = $timeout(function () {
            $scope.showMediaController = false;
            mediaControllerTimer = null;
        }, CONSTANT.MEDIA_CONTROLLER_TIMEOUT);
    }

    // 'Changing depth' means the scene is changed.
    function changeDepth(depth, callback) {
        $scope.lastDepth = $scope.currentDepth;
        $scope.currentDepth = depth;
        $timeout(function () {
            console.log("change depth ...", depth);
            focusController.setDepth(depth);
            if (depth === $scope.DEPTH.DETAIL) {
                focusController.focus('btnPlay');
            }

            callback && callback();
        }, 100);
    }

    // Update and reload data for each list component.
    function updateCategoryListData(response, category, reload) {
        $scope.dataCategory[category] = response;
        // console.log("dataCategory: ", $scope.dataCategory);
        $timeout(function () {
            reload && $('#list-' + category).trigger('reload');
        }, 0);
    }

    // Change data on overview.
    function updateOverview() {
        // console.log("updateOverview:", currentItemData);
        $scope.overview = currentItemData;
        $scope.currentOverview = currentItemData;
        $scope.isOverviewDark = false;
    }

    // Translate specific element using css property 'transform'.
    /**
     * 
     * 
     * @param {any} category 
     * @param {any} regionId 
     * @param {any} targetTop 
     * @returns 
     */

    function moveContainer(category, regionId, targetTop) {
        if (category === $scope.currentCategory) {
            return;
        }
        $('.' + regionId).css({
            transform: 'translate3d(0, ' + targetTop + 'px, 0)'
        });
        $scope.currentCategory = category;
    }

    /**
     * moveCategoryVodContainer
     * 
     * @param {any} regionId 
     * @param {any} targetTop 
     */
    function moveCategoryVodContainer(targetTop) {
        $('.category-container').css({
            transform: 'translate3d(0, ' + targetTop + 'px, 0)'
        });
    }

    function showExitConfirmDialog() {
        $timeout(function () {
            $scope.dialog.show = true;
            $scope.dialog.isConfirm = true;
            $scope.dialog.message = "Bạn có muốn thoát ứng dụng ViettelTV không?";
            $scope.dialog.title = "Thoát ứng dụng";
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    function showMediaErrorAlertDialog() {
        $timeout(function () {
            $scope.alert.show = true;
            $scope.alert.message = "Nội dung này được mã hóa. Vui lòng xem nội dung này trên Set-top-box hoặc ứng dụng ViettelTV trên điện thoại!";
            $scope.alert.title = "Nội dung chưa được hỗ trợ trên SmartTV";
        }, CONSTANT.EFFECT_DELAY_TIME);
    }


    function showNetworkDisconnectedWarning() {
        $timeout(function () {
            $scope.warning.show = true;
            // $scope.dialog.isConfirm = false;
            $scope.warning.message = "Mất kết nối Internet. Vui lòng kiểm tra lại kết nối";
            $scope.warning.title = "Mất kết nối";
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    function back() {
        // alert('back.....')
        console.log("back 1111...");
        if ($scope.showMediaController === true) {
            $scope.showMediaController = false;
            mediaControllerTimer = null;
            return;
        }

        if ($scope.currentDepth === $scope.DEPTH.PLAYER && $scope.isChannelQuicklistShown) {
            console.log("return to isChannelQuicklistShown ...");
            $scope.isForceChannelInfoShown = false;
            $scope.isChannelQuicklistShown = false;
            // $(".channel-page").fadeOut(1000, "linear");
            return;
        }

        console.log("back 2222...");
        toaster.clear('*');
        $timeout.cancel(detailSectionTimmer);
        $timeout.cancel(processPlayerTimer);
        $interval.cancel(videoProgressTrackTimer);
        VideoService.stopStream(video);
        $scope.isPlayDisabled = false;
        $scope.isMediaLoaderHidden = true;
        // $scope.showMediaController = false;
        $scope.isForceInfoShown = false;
        $scope.isListPageFadeOut = false;
        $scope.isPlayerShown = false;
        // $scope.showMediaController = false;
        // mediaControllerTimer = null;

        var focusClass;
        var targetDepth;
        switch ($scope.currentDepth) {
            case $scope.DEPTH.INDEX:
                if ($scope.dialog.show) {
                    $scope.dialog.show = false;
                } else {
                    showExitConfirmDialog();
                }

                return;
            case $scope.DEPTH.DETAIL:
                $('.related-play-list').css('z-index', 19);
                $('.episode-play-list').css('z-index', 19);
                $scope.isListPageFadeOut = false;
                if (lastCategoryVodFocusedGroup === 'VOD_LIST_CATEGORY') {
                    $scope.bgImgUrl = '';
                    $scope.relatedPlaylist = [CONSTANT.ITEM];
                    targetDepth = $scope.DEPTH.CATEGORY;
                    $scope.currentDepth = $scope.DEPTH.CATEGORY;
                    $timeout(function () {
                        focusController.setDepth(targetDepth, lastCategoryVodFocusedGroup);
                        // lastFocusedGroup = categoryMenuFocusedGroup;
                    }, CONSTANT.EFFECT_DELAY_TIME);
                } else {
                    $scope.relatedPlaylist = [CONSTANT.ITEM];
                    targetDepth = $scope.DEPTH.INDEX;
                    $scope.currentDepth = $scope.DEPTH.INDEX;
                    // $timeout(function () {

                    if ($scope.currentOverview.isSpotlight) {
                        console.log("$scope.currentOverview.isSpotlight ...");
                        $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
                    }

                    console.log("return to index ...", targetDepth, lastFocusedGroup);
                    focusController.setDepth(targetDepth, lastFocusedGroup);
                    // }, CONSTANT.EFFECT_DELAY_TIME);
                }
                break;
            case $scope.DEPTH.PLAYER:



                targetDepth = $scope.lastDepth;
                $scope.isPlayDisabled = false;
                $scope.isForceInfoShown = true;

                if (!$scope.currentOverview.isChannel) {
                    setVodDetailPackground($scope.currentOverview.bigPhotoUrl);
                }

                $timeout(function () {
                    // $('.background-layer').css('opacity', 1);
                    $(".background-layer").fadeIn(100, "linear");
                    // $(".category-section").fadeIn(500, "linear");
                    $(".channel-page").fadeIn(1000, "linear");

                    if (!$scope.currentOverview.isChannel) {
                        $(".category-section").fadeIn(500, "linear");
                    }

                    $scope.isInfoShownInPlayer = true;
                    $scope.isForceInfoShown = true;

                    if ($scope.currentOverview.isChannel) {
                        if (lastCategoryChannelFocusedGroup === 'VOD_LIST_CATEGORY') {
                            console.log("return to detail VOD_LIST_CATEGORY ...", targetDepth, lastHomeChannelFocusedGroup);
                            $(".category-page").fadeIn(500, "linear");

                            $scope.lastDepth = $scope.currentDepth;
                            targetDepth = $scope.DEPTH.CATEGORY;
                            $scope.currentDepth = targetDepth;

                            $timeout(function () {
                                console.log(" $scope.channelOverview...", $scope.channelOverview);
                                focusController.setDepth(targetDepth, 'VOD_LIST_CATEGORY');
                                focusController.focus("category-vod-item-" + $scope.channelOverview.channelId);
                                // focusController.focus($("#category-vod-item-0"));

                            }, 300);


                        } else {
                            targetDepth = $scope.DEPTH.INDEX;
                            $(".channel-page").fadeIn(500, "linear");
                            $(".category-section").fadeIn(500, "linear");
                            $(".category-page").fadeIn(500, "linear");
                            $(".list-wrapper.page").fadeIn(500, "linear");

                            changeDepth(targetDepth, function () {
                                console.log("return to detail 2...", targetDepth, lastHomeChannelFocusedGroup);
                                focusController.focus($("#channel-item-" + $scope.channelOverview.channelId));
                            })
                        }

                    } else {
                        console.log("return to detail 3...", targetDepth, lastFocusedGroup);
                        focusController.setDepth(targetDepth, lastFocusedGroup);
                    }

                    $scope.lastDepth = $scope.DEPTH.PLAYER;
                }, CONSTANT.EFFECT_DELAY_TIME);
                focusClass = '.btn-resume';
                break;
            case $scope.DEPTH.LOGIN:
                LoginService.closeLoginPage();
                // alert('111:' + targetDepth);

                targetDepth = $scope.lastDepth;
                console.log("closeLoginPage222..", targetDepth, lastFocusedGroup);
                focusClass = '.btn-resume';


                if ($scope.lastDepth === $scope.DEPTH.DETAIL) {
                    changeDepth($scope.DEPTH.DETAIL);
                } else if ($scope.lastDepth === $scope.DEPTH.INDEX) {
                    changeDepth($scope.DEPTH.INDEX);
                } else if ($scope.lastDepth === $scope.DEPTH.CATEGORY) {
                    changeDepth($scope.DEPTH.CATEGORY);
                }


                break;
            case $scope.DEPTH.CATEGORY:
                var currentGroup = focusController.getCurrentGroup();
                if (currentGroup === 'VOD_LIST_CATEGORY') {
                    targetDepth = $scope.DEPTH.CATEGORY;
                    $timeout(function () {
                        console.log("SIDEBAR_CATEGORY..");
                        focusController.setGroup('SIDEBAR_CATEGORY');
                    }, 150);
                } else {
                    targetDepth = $scope.DEPTH.INDEX;
                    $timeout(function () {
                        focusController.setDepth(targetDepth, 'MENU');
                    }, CONSTANT.EFFECT_DELAY_TIME);
                }
                focusClass = '.btn-resume';
                break;
            default:
                targetDepth = $scope.DEPTH.INDEX;
                break;
        }
        $scope.currentDepth = targetDepth;
    }

    function isCurrentItemOnChannel() {
        return $($scope.currentFocusItem).parents('.list-area.channel').length > 0;
    }

    function addFadeoutUpClassToItem(item) {
        item.addClass('list-fadeout-up');
    }

    function removeFadeoutUpClassToCurrentSlider() {
        $scope.currentFocusItem = focusController.getCurrentFocusItem();
        var currentSlider = $($scope.currentFocusItem).parents('.list-area');
        currentSlider.removeClass('list-fadeout-up');
    }

    function addFadeoutUpClassToPrevSlider() {
        $scope.currentFocusItem = focusController.getCurrentFocusItem();
        $($scope.currentFocusItem).parents(".list-area").parent().prev().find('.list-area').addClass('list-fadeout-up');
    }

    $scope.dialog = {
        show: false,
        center: true,
        isConfirm: true,
        focusOption: {
            depth: $scope.DEPTH.DIALOG
        },
        onSelectButton: function (buttonIndex, $event) {
            console.log("$scope.dialog.isConfirm:", $scope.dialog.isConfirm);
            if ($scope.dialog.isConfirm) {
                if (buttonIndex === 0) {
                    try {
                        tizen.application.getCurrentApplication().exit();
                    } catch (error) {
                        // console.error('Not Tizen platform:',error);                        
                        window.close();
                    }


                } else {
                    $scope.dialog.show = false;

                }
            } else {
                $scope.dialog.show = false;
            }

        }

    };
    $scope.alert = {
        show: false,
        center: true,
        focusOption: {
            depth: $scope.DEPTH.ALERT
        },
        onSelectButton: function (buttonIndex, $event) {
            $scope.dialog.show = false;

        }

    };

    $scope.warning = {
        show: false,
        center: true,
        isConfirm: true,
        focusOption: {
            depth: $scope.DEPTH.WARNING
        }

    };

}