import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { vdsOperations } from '../../../Redux'

import s from './EditModal.module.scss'

export default function EditModal({ elid, closeFn }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(vdsOperations.editVDS(elid))
  }, [])

  return (
    <div className={s.modal}>
      <button onClick={closeFn}>!!!!!!!!!!!</button>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita pariatur delectus
      repellendus laboriosam, commodi quas ducimus. Perspiciatis atque nam impedit, quia,
      doloremque sint laudantium explicabo magnam, nihil ab veniam nostrum! Eum architecto
      inventore vel error laudantium impedit quisquam voluptatem quasi voluptas sint,
      suscipit hic nihil illo aliquid fugit adipisci consequatur distinctio maxime
      assumenda iusto facere tempore fugiat doloribus accusantium? Voluptate? Labore
      quibusdam culpa necessitatibus exercitationem, tempora in eligendi ducimus, mollitia
      dolor nam architecto dolore reiciendis, quas magnam nisi perferendis nulla voluptate
      at. Molestiae, quaerat? Soluta expedita ratione corporis architecto omnis. Sequi
      totam alias ab non distinctio in facilis veniam fuga aliquam tempore doloribus,
      molestias a illum inventore ad pariatur aspernatur sed asperiores magni ea. Id
      necessitatibus sed dignissimos quia veritatis! Nisi velit alias nobis qui quos vero
      veritatis quibusdam doloremque perferendis cumque! At nesciunt quibusdam aliquam
      vitae. Officiis, error, natus expedita eveniet sequi ducimus quidem asperiores
      quibusdam illum corporis nostrum? Aliquam repellendus ab dolorum blanditiis maiores
      tempore corporis vero exercitationem qui repudiandae quasi distinctio, rerum maxime
      illo necessitatibus harum eum eius saepe asperiores architecto. Delectus modi fuga p
    </div>
  )
}
